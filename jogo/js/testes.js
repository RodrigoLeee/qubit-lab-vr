// Página de testes de interação: mirar e confirmar com e sem controle.
//
// Entradas (uma por vez):
//   - Olhar (sem mãos, padrão): anel preso à câmera; mirar = cabeça, confirmar = 1,5 s olhando.
//   - Controle: laser + gatilho; ao conectar, o olhar é desligado.
//   - PC: mouse (clique) ou barra de espaço confirmando o que o anel do olhar mira.

(function () {
  const FONTE = '"Segoe UI", "Cambria Math", "Segoe UI Symbol", sans-serif';

  // ---------- Anel do olhar que enche durante o fuse ----------
  AFRAME.registerComponent('anel-fuse', {
    schema: { tempo: { default: 1500 }, progresso: { type: 'selector' } },
    init: function () {
      this.inicio = null;
      this.el.addEventListener('fusing', () => { this.inicio = performance.now(); });
      const parar = () => { this.inicio = null; this.definir(0); };
      this.el.addEventListener('mouseleave', parar);
      this.el.addEventListener('click', parar);
    },
    definir: function (p) {
      const anel = this.data.progresso;
      if (!anel) return;
      anel.object3D.visible = p > 0.01;
      if (p > 0.01) anel.setAttribute('geometry', 'thetaLength', Math.min(p, 1) * 360);
    },
    tick: function () {
      if (this.inicio === null) return;
      this.definir((performance.now() - this.inicio) / this.data.tempo);
    }
  });

  // Nome da entrada que gerou uma confirmação (usado no registro e no placar).
  function nomeEntrada(d, cena) {
    if (!d) return 'Mouse';
    if (d.viaAceno) return 'Aceno';
    if (d.viaEspaco) return 'Espaço';
    if (!d.cursorEl || d.cursorEl === cena) return 'Mouse';
    if (d.cursorEl.id === 'olhar') return 'Olhar';
    return 'Controle';
  }
  QL.nomeEntrada = nomeEntrada;

  // ---------- Ideia sem mãos do grupo: aceno de cabeça ----------
  // Mirar: o olhar (cabeça). Confirmar: um aceno rápido (baixar e voltar a cabeça).
  // A amplitude do aceno vira força no lançamento da bolinha.
  AFRAME.registerComponent('aceno-cabeca', {
    schema: {
      limiar: { default: 10 },   // graus mínimos de descida
      janela: { default: 700 },  // ms para descer e voltar
      espera: { default: 900 }   // ms entre dois acenos
    },
    init: function () {
      this.historico = [];
      this.liberadoEm = 0;
      this.quat = new THREE.Quaternion();
      this.euler = new THREE.Euler();
    },
    tick: function (t) {
      this.el.object3D.getWorldQuaternion(this.quat);
      this.euler.setFromQuaternion(this.quat, 'YXZ');
      const pitch = THREE.MathUtils.radToDeg(this.euler.x); // positivo = olhando para cima

      const h = this.historico;
      h.push({ t, p: pitch });
      while (h.length && t - h[0].t > this.data.janela) h.shift();
      if (t < this.liberadoEm || h.length < 5) return;

      const inicio = h[0].p;
      let min = Infinity, iMin = 0;
      h.forEach((s, i) => { if (s.p < min) { min = s.p; iMin = i; } });
      const amplitude = inicio - min;
      const voltou = Math.abs(pitch - inicio) < amplitude * 0.35;
      if (amplitude >= this.data.limiar && iMin > 0 && iMin < h.length - 1 && voltou) {
        this.historico = [];
        this.liberadoEm = t + this.data.espera;
        this.el.sceneEl.emit('aceno', { amplitude });
      }
    }
  });

  // ---------- Gerência das entradas ----------
  AFRAME.registerComponent('entradas-teste', {
    schema: { olhar: { type: 'selector' } },
    init: function () {
      this.controles = new Set();
      this.modo = 'PC';
      this.usarOlhar(true); // começa no modo que sempre funciona

      // Tem VR? Entrou no VR? (sinais 1 e 2 da aula)
      if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported('immersive-vr').then((ok) => {
          this.temVR = ok;
          this.avisar();
        }).catch(() => {});
      }
      this.el.addEventListener('enter-vr', () => { this.modo = 'VR'; this.avisar(); });
      this.el.addEventListener('exit-vr', () => { this.modo = 'PC'; this.avisar(); });

      // Último alvo do olhar, usado pelo aceno (a cabeça desce durante o aceno).
      this.data.olhar.addEventListener('raycaster-intersection', (e) => {
        this.ultimoAlvo = e.detail.els[0];
        this.ultimoAlvoEm = performance.now();
      });

      // Depois de confirmar pelo olhar, pausa 1 s antes de aceitar outro alvo:
      // evita que, ao teleportar ou abrir o painel, o olhar acione o que estiver na frente.
      this.data.olhar.addEventListener('click', () => this.pausarOlhar());

      // Aceno de cabeça confirma o que o olhar está mirando.
      this.el.addEventListener('aceno', (e) => {
        if (!this.olharAtivo) return;
        const alvo = this.alvoDoOlhar(1200);
        if (!alvo) return;
        const rc = this.data.olhar.components.raycaster;
        alvo.emit('click', {
          cursorEl: this.data.olhar, intersection: rc.getIntersection(alvo),
          viaAceno: true, forca: e.detail.amplitude
        });
        this.pausarOlhar();
      });

      document.querySelectorAll('[laser-controls]').forEach((mao) => {
        mao.addEventListener('controllerconnected', (e) => {
          const nome = (e.detail && e.detail.name) || '';
          if (nome.includes('hand')) return; // mãos não contam como controle aqui
          this.controles.add(mao);
          this.usarOlhar(false);
        });
        mao.addEventListener('controllerdisconnected', () => {
          this.controles.delete(mao);
          if (this.controles.size === 0) this.usarOlhar(true);
        });
      });

      // PC: barra de espaço (gatilho provisório). Com alvo na mira, confirma na hora;
      // sem alvo, lança a bolinha para a frente, na direção da câmera.
      window.addEventListener('keydown', (e) => {
        if (e.code !== 'Space') return;
        e.preventDefault();
        const olhar = this.data.olhar;
        const rc = olhar.components.raycaster;
        const alvo = this.olharAtivo && rc && rc.intersectedEls[0];
        if (alvo) {
          alvo.emit('click', { cursorEl: olhar, intersection: rc.getIntersection(alvo), viaEspaco: true });
          return;
        }
        const lancador = document.querySelector('[alvo-lancamento]');
        if (!lancador) return;
        const cam = this.el.camera;
        const origem = cam.getWorldPosition(new THREE.Vector3());
        const frente = cam.getWorldDirection(new THREE.Vector3()); // a câmera do three.js já olha para −Z
        lancador.components['alvo-lancamento'].lancar(origem, origem.clone().addScaledVector(frente, 10), 'Espaço');
      });
    },

    alvoDoOlhar: function (toleranciaMs) {
      const rc = this.data.olhar.components.raycaster;
      const atual = rc && rc.intersectedEls[0];
      if (atual) return atual;
      if (this.ultimoAlvo && performance.now() - this.ultimoAlvoEm < toleranciaMs) return this.ultimoAlvo;
      return null;
    },

    pausarOlhar: function () {
      if (!this.olharAtivo) return;
      // Adia para depois do clique chegar ao alvo (e ao registro do teste).
      setTimeout(() => this.data.olhar.setAttribute('raycaster', 'enabled', false), 0);
      clearTimeout(this.pausa);
      this.pausa = setTimeout(() => {
        if (this.olharAtivo) this.data.olhar.setAttribute('raycaster', 'enabled', true);
      }, 1000);
    },

    usarOlhar: function (ligado) {
      this.olharAtivo = ligado;
      const olhar = this.data.olhar;
      olhar.setAttribute('visible', ligado);
      olhar.setAttribute('raycaster', 'enabled', ligado);
      this.avisar();
    },

    avisar: function () {
      this.el.emit('entrada-mudou', {
        olhar: this.olharAtivo, modo: this.modo, temVR: !!this.temVR
      });
    }
  });

  // ---------- Pontos de teleporte ----------
  AFRAME.registerComponent('ponto-teleporte', {
    init: function () {
      const el = this.el;
      const add = (tag, attrs) => {
        const filho = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => filho.setAttribute(k, v));
        el.appendChild(filho);
        return filho;
      };
      this.anel = add('a-ring', {
        rotation: '-90 0 0', position: '0 0.03 0', 'radius-inner': 0.38, 'radius-outer': 0.48,
        material: 'color: #2EF2F2; shader: flat; side: double; transparent: true; opacity: 0.85'
      });
      this.coluna = add('a-cylinder', {
        position: '0 0.9 0', radius: 0.45, height: 1.8, 'open-ended': true,
        material: 'color: #2EF2F2; shader: flat; side: double; transparent: true; opacity: 0.08; depthWrite: false'
      });
      // Área clicável baixa (até 1 m): é preciso olhar para baixo, para o olhar
      // não acionar o ponto só de olhar para o horizonte.
      add('a-cylinder', {
        class: 'ponto-teleporte', position: '0 0.5 0', radius: 0.5, height: 1.0,
        material: 'transparent: true; opacity: 0; depthWrite: false'
      });
      this.fontes = new Set();

      el.addEventListener('mouseenter', (e) => this.hover(e, true));
      el.addEventListener('mouseleave', (e) => this.hover(e, false));
      el.addEventListener('click', (e) => {
        if (!QL.cliqueValido(e, el.sceneEl)) return;
        const destino = new THREE.Vector3();
        el.object3D.getWorldPosition(destino);
        QL.irPara(destino);
        this.fontes.clear();
        this.destacar();
      });
      this.posCamera = new THREE.Vector3();
      this.posPonto = new THREE.Vector3();
    },
    hover: function (e, ativo) {
      const fonte = (e.detail && e.detail.cursorEl) || 'cursor';
      if (ativo) this.fontes.add(fonte); else this.fontes.delete(fonte);
      this.destacar();
    },
    destacar: function () {
      const ativo = this.fontes.size > 0;
      this.anel.setAttribute('material', 'color', ativo ? '#FF6BF2' : '#2EF2F2');
      this.coluna.setAttribute('material', 'opacity', ativo ? 0.25 : 0.08);
    },
    // Esconde o ponto onde o jogador já está.
    tick: function () {
      const camera = this.el.sceneEl.camera;
      if (!camera) return;
      camera.getWorldPosition(this.posCamera);
      this.el.object3D.getWorldPosition(this.posPonto);
      const perto = Math.hypot(this.posCamera.x - this.posPonto.x, this.posCamera.z - this.posPonto.z) < 0.9;
      if (this.el.object3D.visible === perto) this.el.object3D.visible = !perto;
    }
  });

  // Rótulos, painel de texto e demonstração de emaranhamento ficam em fenomenos.js.

  // ---------- Registro do teste (placa na cena) ----------
  // Mede o tempo entre começar a mirar um alvo e confirmar, por entrada. Nada é gravado.
  AFRAME.registerComponent('registro-interacao', {
    schema: { placa: { type: 'selector' } },
    init: function () {
      this.entradaAtual = 'Olhar + aceno';
      this.miras = new Map();
      this.confirmacoes = 0;
      this.ultima = '—';

      const alvo = (e) => {
        const t = e.target;
        if (!t.classList) return null;
        if (t.classList.contains('botao') || t.classList.contains('ponto-teleporte') || t.classList.contains('alvo')) return t;
        return null;
      };
      const nomeDoAlvo = (a) => {
        if (a.getAttribute('botao-neon')) return a.getAttribute('botao-neon').texto;
        if (a.classList.contains('alvo')) return 'Lançamento';
        return 'Teleporte';
      };

      // Tempo de mira guardado por alvo E por entrada (mouse, olhar, controle),
      // para uma entrada não apagar a mira da outra.
      const cursorDe = (e) => (e.detail && e.detail.cursorEl) || this.el;
      const mirasDe = (a) => {
        if (!this.miras.has(a)) this.miras.set(a, new Map());
        return this.miras.get(a);
      };
      this.el.addEventListener('mouseenter', (e) => {
        const a = alvo(e);
        if (!a) return;
        const m = mirasDe(a);
        if (!m.has(cursorDe(e))) m.set(cursorDe(e), performance.now());
      });
      this.el.addEventListener('mouseleave', (e) => {
        const a = alvo(e);
        if (a) mirasDe(a).delete(cursorDe(e));
      });
      this.el.addEventListener('click', (e) => {
        const a = alvo(e);
        if (!a) return;
        const m = mirasDe(a);
        const inicio = m.get(cursorDe(e));
        const seg = inicio ? ((performance.now() - inicio) / 1000).toFixed(1).replace('.', ',') : '—';
        m.delete(cursorDe(e));
        this.confirmacoes += 1;
        this.ultima = `${nomeDoAlvo(a)} · ${nomeEntrada(e.detail, this.el)} · ${seg} s`;
        console.log(`[teste] ${this.ultima}`);
        this.atualizar();
      });
      this.modo = 'PC';
      this.el.addEventListener('entrada-mudou', (e) => {
        this.entradaAtual = e.detail.olhar ? 'Olhar + aceno' : 'Controle';
        this.modo = e.detail.modo === 'VR' ? 'VR' : (e.detail.temVR ? 'PC (VR disponível)' : 'PC');
        this.atualizar();
      });
      this.atualizar();
    },
    atualizar: function () {
      const placa = this.data.placa;
      if (!placa) return;
      placa.setAttribute('botao-neon', {
        texto: `Entrada: ${this.entradaAtual} · ${this.modo || 'PC'}`,
        subtexto: `Última: ${this.ultima} · confirmações: ${this.confirmacoes}`
      });
    }
  });

  // ---------- Desafio da bolinha (arquivo 4 da aula) ----------
  // Todas as entradas chegam em um só lugar: lancar(origem, destino).
  //   Gatilho (controle) e olhar: click no alvo → origem = quem clicou, destino = ponto do raio.
  //   Barra de espaço: lança na direção da câmera.
  //   Aceno de cabeça: click no alvo, com força proporcional à amplitude do aceno.
  AFRAME.registerComponent('alvo-lancamento', {
    schema: {
      velocidade: { default: 8 },
      placar: { type: 'selector' }
    },

    init: function () {
      this.bolas = [];
      this.placar = {};
      this.caixa = new THREE.Box3();
      this.material = null;

      this.el.addEventListener('click', (e) => {
        const d = e.detail || {};
        if (!QL.cliqueValido(e, this.el.sceneEl)) return;
        const entrada = nomeEntrada(d, this.el.sceneEl);
        const cursor = d.cursorEl && d.cursorEl !== this.el.sceneEl ? d.cursorEl.object3D : null;
        const origem = cursor
          ? cursor.getWorldPosition(new THREE.Vector3())
          : this.el.sceneEl.camera.getWorldPosition(new THREE.Vector3());
        const destino = d.intersection ? d.intersection.point.clone() : this.el.object3D.getWorldPosition(new THREE.Vector3());
        // Confirmar dá força: no aceno, a amplitude define a velocidade.
        const velocidade = d.viaAceno && d.forca
          ? THREE.MathUtils.clamp(4 + d.forca * 0.3, 5, 14)
          : this.data.velocidade;
        this.lancar(origem, destino, entrada, velocidade);
      });
      this.atualizarPlacar();
    },

    // Mesma função de voo para todas as entradas.
    lancar: function (origem, destino, entrada, velocidade) {
      const v = velocidade || this.data.velocidade;
      const bola = document.createElement('a-sphere');
      bola.setAttribute('radius', 0.08);
      bola.setAttribute('material', 'color: #FF6BF2; emissive: #FF6BF2; emissiveIntensity: 0.9');
      bola.object3D.position.copy(origem);
      this.el.sceneEl.appendChild(bola);

      // Velocidade que leva a bola até o ponto mirado, compensando a gravidade.
      const delta = destino.clone().sub(origem);
      const tempo = Math.max(delta.length() / v, 0.05);
      const vel = delta.divideScalar(tempo);
      vel.y += 0.5 * 9.8 * tempo;

      this.bolas.push({ bola, vel, vida: 3, entrada });
      const p = this.placar[entrada] || (this.placar[entrada] = { lancamentos: 0, acertos: 0 });
      p.lancamentos += 1;
      this.atualizarPlacar();
    },

    tick: function (t, dt) {
      if (!this.bolas.length) return;
      const s = Math.min(dt / 1000, 0.05);
      this.caixa.setFromObject(this.el.object3D).expandByScalar(0.08);
      for (const b of this.bolas) {
        b.vel.y -= 9.8 * s;
        b.bola.object3D.position.addScaledVector(b.vel, s);
        b.vida -= s;
        if (b.vida > 0 && this.caixa.containsPoint(b.bola.object3D.position)) {
          b.vida = 0;
          this.placar[b.entrada].acertos += 1;
          this.piscar();
          this.atualizarPlacar();
        }
        if (b.vida <= 0) b.bola.remove();
      }
      this.bolas = this.bolas.filter((b) => b.vida > 0);
    },

    piscar: function () {
      this.el.setAttribute('material', 'emissiveIntensity', 1);
      clearTimeout(this.timerPiscar);
      this.timerPiscar = setTimeout(() => this.el.setAttribute('material', 'emissiveIntensity', 0.35), 300);
    },

    atualizarPlacar: function () {
      const placa = this.data.placar;
      if (!placa) return;
      const partes = Object.entries(this.placar).map(([nome, p]) => `${nome} ${p.acertos}/${p.lancamentos}`);
      placa.setAttribute('botao-neon', {
        texto: 'Desafio: acerte o alvo',
        subtexto: partes.length ? `Acertos/lançamentos · ${partes.join(' · ')}` : 'Mire e confirme: olhar 1,5 s, aceno, espaço ou gatilho'
      });
    }
  });

  // ---------- Lousa desenhada com a cabeça (arquivo 6 da aula) ----------
  // Mirar: o centro da visão. Ligar/desligar: botão confirmado pelo olhar ou aceno.
  AFRAME.registerComponent('quadro-olhar', {
    schema: { largura: { default: 1.6 }, altura: { default: 1 }, botao: { type: 'selector' } },

    init: function () {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 512;
      this.canvas.height = 320;
      this.ctx = this.canvas.getContext('2d');
      this.textura = new THREE.CanvasTexture(this.canvas);
      this.textura.colorSpace = THREE.SRGBColorSpace;
      this.malha = new THREE.Mesh(
        new THREE.PlaneGeometry(this.data.largura, this.data.altura),
        new THREE.MeshBasicMaterial({ map: this.textura, fog: false })
      );
      this.el.setObject3D('mesh', this.malha);
      this.limpar();

      this.ligada = false;
      this.ultimo = null;
      this.raycaster = new THREE.Raycaster();
      this.origem = new THREE.Vector3();
      this.direcao = new THREE.Vector3();

      this.el.sceneEl.addEventListener('botao-acao', (e) => {
        if (e.detail.acao === 'caneta') this.alternar();
        if (e.detail.acao === 'limpar') this.limpar();
      });
    },

    alternar: function () {
      this.ligada = !this.ligada;
      this.ultimo = null;
      if (this.data.botao) {
        this.data.botao.setAttribute('botao-neon', {
          texto: this.ligada ? 'Caneta: ligada' : 'Caneta: desligada',
          subtexto: this.ligada ? 'Olhe de novo para desligar' : 'Olhe para ligar e desenhe com a cabeça'
        });
      }
    },

    limpar: function () {
      const { ctx } = this;
      ctx.fillStyle = '#050B1C';
      ctx.fillRect(0, 0, 512, 320);
      ctx.strokeStyle = '#2EF2F2';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 508, 316);
      ctx.strokeStyle = '#FF6BF2';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      this.ultimo = null;
      this.textura.needsUpdate = true;
    },

    tick: function () {
      if (!this.ligada) return;
      const camera = this.el.sceneEl.camera;
      camera.getWorldPosition(this.origem);
      camera.getWorldDirection(this.direcao);
      this.raycaster.set(this.origem, this.direcao);
      const hit = this.raycaster.intersectObject(this.malha, false)[0];
      if (!hit || !hit.uv) { this.ultimo = null; return; } // caneta fora da lousa
      const p = [hit.uv.x * 512, (1 - hit.uv.y) * 320];
      if (this.ultimo) {
        this.ctx.beginPath();
        this.ctx.moveTo(...this.ultimo);
        this.ctx.lineTo(...p);
        this.ctx.stroke();
        this.textura.needsUpdate = true;
      }
      this.ultimo = p;
    }
  });
})();

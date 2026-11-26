// Fenômenos quânticos: elementos compartilhados pelo modo Quântico e pela página de testes.
//   - rótulos em canvas e painel de texto com quebra de linha;
//   - elétron com nuvem, núcleo e seta de spin;
//   - estações de superposição, medição e emaranhamento.
// As ações chegam pelos botões neon (evento 'botao-acao'), com um prefixo por estação.

(function () {
  const FONTE = '"Segoe UI", "Cambria Math", "Segoe UI Symbol", sans-serif';
  const CIANO = '#2EF2F2';
  const MAGENTA = '#FF6BF2';

  // ---------- Rótulo em canvas ----------
  function rotulo(texto, cor, altura) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true, depthWrite: false, fog: false }));
    sprite.scale.set(altura * 4, altura, 1);
    sprite.userData.escrever = (t, c) => {
      ctx.clearRect(0, 0, 512, 128);
      ctx.font = `bold 64px ${FONTE}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = c;
      ctx.shadowBlur = 14;
      ctx.fillStyle = c;
      ctx.fillText(t, 256, 64);
      textura.needsUpdate = true;
    };
    sprite.userData.escrever(texto, cor);
    return sprite;
  }

  // ---------- Elétron: nuvem, núcleo, seta de spin e nome ----------
  function criarEletron(pai, x, nome) {
    const grupo = new THREE.Group();
    grupo.position.set(x, 0, 0);

    const nuvem = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 24),
      new THREE.MeshStandardMaterial({ color: CIANO, emissive: '#0A8FA8', emissiveIntensity: 0.6, transparent: true, opacity: 0.25, depthWrite: false })
    );
    const nucleo = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 12),
      new THREE.MeshStandardMaterial({ color: '#E6FBFF', emissive: CIANO, emissiveIntensity: 1 })
    );
    const matSeta = new THREE.MeshStandardMaterial({ color: MAGENTA, emissive: MAGENTA, emissiveIntensity: 0.9 });
    const seta = new THREE.Group();
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 10), matSeta);
    const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 14), matSeta);
    ponta.position.y = 0.22;
    seta.add(haste, ponta);

    const texto = rotulo(nome, '#E6FBFF', 0.09);
    texto.position.y = 0.42;

    grupo.add(nuvem, nucleo, seta, texto);
    pai.add(grupo);

    const e = { grupo, seta, matSeta, nuvem, texto, nome };
    e.fixar = (cima, legenda) => {
      e.seta.rotation.set(0, 0, cima ? 0 : Math.PI);
      const cor = cima ? CIANO : MAGENTA;
      e.matSeta.color.set(cor);
      e.matSeta.emissive.set(cor);
      e.texto.userData.escrever(legenda || `${nome}: ${cima ? '↑' : '↓'}`, cor);
    };
    e.soltar = () => {
      e.matSeta.color.set(MAGENTA);
      e.matSeta.emissive.set(MAGENTA);
      e.texto.userData.escrever(nome, '#E6FBFF');
    };
    return e;
  }

  // ---------- Painel de texto com quebra de linha ----------
  AFRAME.registerComponent('painel-texto', {
    schema: { largura: { default: 1.6 }, altura: { default: 1.1 } },
    init: function () {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1024;
      this.canvas.height = Math.round(1024 * this.data.altura / this.data.largura);
      this.ctx = this.canvas.getContext('2d');
      this.textura = new THREE.CanvasTexture(this.canvas);
      this.textura.colorSpace = THREE.SRGBColorSpace;
      this.el.setObject3D('mesh', new THREE.Mesh(
        new THREE.PlaneGeometry(this.data.largura, this.data.altura),
        new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, fog: false, side: THREE.DoubleSide })
      ));
      this.el.object3D.visible = false;
    },
    escrever: function (titulo, paragrafos) {
      const { ctx, canvas } = this;
      const W = canvas.width, H = canvas.height, m = 56;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(3, 10, 30, 0.9)';
      ctx.strokeStyle = CIANO;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(6, 6, W - 12, H - 12, 28);
      ctx.fill();
      ctx.stroke();

      ctx.textBaseline = 'top';
      ctx.fillStyle = CIANO;
      ctx.font = `bold 46px ${FONTE}`;
      ctx.fillText(titulo, m, m);

      ctx.fillStyle = '#E6FBFF';
      ctx.font = `32px ${FONTE}`;
      let y = m + 80;
      paragrafos.forEach((p) => {
        let linha = '';
        p.split(' ').forEach((palavra) => {
          const teste = linha ? `${linha} ${palavra}` : palavra;
          if (ctx.measureText(teste).width > W - 2 * m) {
            ctx.fillText(linha, m, y);
            y += 44;
            linha = palavra;
          } else {
            linha = teste;
          }
        });
        if (linha) { ctx.fillText(linha, m, y); y += 44; }
        y += 18;
      });
      this.textura.needsUpdate = true;
    },
    mostrar: function (visivel, titulo, paragrafos) {
      this.el.object3D.visible = visivel;
      if (visivel) this.escrever(titulo, paragrafos);
    }
  });

  // Liga as ações dos botões neon (com prefixo) a uma estação.
  function ouvirAcoes(componente, prefixo, mapa) {
    componente.el.sceneEl.addEventListener('botao-acao', (e) => {
      const acao = e.detail.acao;
      if (!acao.startsWith(prefixo)) return;
      const f = mapa[acao.slice(prefixo.length)];
      if (f) f.call(componente);
    });
  }

  // ---------- Estação: emaranhamento ----------
  const TEXTOS_EMARANHAMENTO = {
    antes: {
      titulo: 'Dois elétrons emaranhados',
      corpo: [
        'O spin de cada elétron ainda não está definido: ao medir, ele pode dar ↑ ou ↓, cada um com 50% de chance.',
        'Mas os dois estão emaranhados: o par está no estado (|↑↓⟩ − |↓↑⟩)/√2. Por isso, ao medir os dois, os resultados sempre saem opostos.',
        'Aperte "Medir" para ver o que acontece.'
      ]
    },
    depois: (a, b) => ({
      titulo: `Medição: A = ${a} · B = ${b}`,
      corpo: [
        `O elétron A foi medido e deu ${a}. O elétron B, mesmo longe, dá ${b}: os resultados são correlacionados.`,
        'Cada resultado, sozinho, é aleatório. Por isso o emaranhamento não permite enviar mensagens mais rápido que a luz.',
        'O feixe entre os elétrons é só uma representação da correlação: nada viaja de um para o outro.'
      ]
    })
  };

  AFRAME.registerComponent('demo-emaranhamento', {
    schema: { painel: { type: 'selector' }, distancia: { default: 1.8 }, prefixo: { default: '' } },

    init: function () {
      const d = this.data.distancia / 2;
      this.eletrons = [criarEletron(this.el.object3D, -d, 'Elétron A'), criarEletron(this.el.object3D, d, 'Elétron B')];

      this.feixe = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-d, 0, 0), new THREE.Vector3(d, 0, 0)]),
        new THREE.LineDashedMaterial({ color: MAGENTA, dashSize: 0.06, gapSize: 0.04, transparent: true, opacity: 0.8, fog: false })
      );
      this.feixe.computeLineDistances();
      this.el.object3D.add(this.feixe);

      this.medido = null;
      this.painelAberto = false;
      ouvirAcoes(this, this.data.prefixo, { explicar: this.alternarPainel, medir: this.medir, reiniciar: this.reiniciar });
    },

    medir: function () {
      const aCima = Math.random() < 0.5;
      this.medido = { a: aCima ? '↑' : '↓', b: aCima ? '↓' : '↑' };
      this.eletrons[0].fixar(aCima, `Elétron A: ${this.medido.a}`);
      this.eletrons[1].fixar(!aCima, `Elétron B: ${this.medido.b}`);
      this.atualizarPainel();
    },

    reiniciar: function () {
      this.medido = null;
      this.eletrons.forEach((e) => e.soltar());
      this.atualizarPainel();
    },

    alternarPainel: function () {
      this.painelAberto = !this.painelAberto;
      this.atualizarPainel();
    },

    atualizarPainel: function () {
      const painel = this.data.painel && this.data.painel.components['painel-texto'];
      if (!painel) return;
      const t = this.medido ? TEXTOS_EMARANHAMENTO.depois(this.medido.a, this.medido.b) : TEXTOS_EMARANHAMENTO.antes;
      painel.mostrar(this.painelAberto, t.titulo, t.corpo);
    },

    tick: function (tempo) {
      const t = tempo / 1000;
      // Antes da medição: spins indefinidos, girando sempre em sentidos opostos.
      if (!this.medido) {
        const [A, B] = this.eletrons;
        A.seta.rotation.set(0, 0, t * 1.6);
        B.seta.rotation.set(0, 0, t * 1.6 + Math.PI);
      }
      this.feixe.material.opacity = this.medido ? 0.15 : 0.5 + 0.3 * Math.sin(t * 2);
      this.eletrons.forEach((e) => { e.nuvem.material.opacity = this.medido ? 0.12 : 0.25; });
    }
  });

  // ---------- Lobos de probabilidade (↑ em cima, ↓ embaixo) ----------
  // O tamanho de cada lobo mostra a chance de medir aquele resultado.
  function criarLobos(eletron) {
    const lobo = (cor, y) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 24, 16),
        new THREE.MeshStandardMaterial({ color: cor, emissive: cor, emissiveIntensity: 0.5, transparent: true, opacity: 0.35, depthWrite: false })
      );
      m.position.y = y;
      eletron.grupo.add(m);
      return m;
    };
    const cima = lobo(CIANO, 0.26);
    const baixo = lobo(MAGENTA, -0.26);
    return {
      definir: (pCima) => {
        const s = (p) => Math.max(0.0001, 0.35 + 1.15 * p);
        cima.scale.setScalar(s(pCima));
        baixo.scale.setScalar(s(1 - pCima));
        cima.visible = pCima > 0.001;
        baixo.visible = pCima < 0.999;
      }
    };
  }

  const pct = (p) => `${Math.round(p * 100)}%`;
  const amp = (p) => Math.sqrt(p).toFixed(2).replace('.', ',');

  // ---------- Estação: superposição ----------
  const ESTADOS_SUPERPOSICAO = [0.5, 0.8, 0.2];

  AFRAME.registerComponent('estacao-superposicao', {
    schema: { painel: { type: 'selector' }, placa: { type: 'selector' }, prefixo: { default: 'sup-' } },

    init: function () {
      this.eletron = criarEletron(this.el.object3D, 0, 'Elétron');
      this.lobos = criarLobos(this.eletron);
      this.indice = 0;
      this.painelAberto = false;
      ouvirAcoes(this, this.data.prefixo, { mudar: this.mudar, explicar: this.alternarPainel });
      this.aplicar();
    },

    mudar: function () {
      this.indice = (this.indice + 1) % ESTADOS_SUPERPOSICAO.length;
      this.aplicar();
    },

    aplicar: function () {
      const p = ESTADOS_SUPERPOSICAO[this.indice];
      this.lobos.definir(p);
      if (this.data.placa) {
        this.data.placa.setAttribute('botao-neon', {
          texto: `P(↑) ${pct(p)} · P(↓) ${pct(1 - p)}`,
          subtexto: `|ψ⟩ = ${amp(p)}|↑⟩ + ${amp(1 - p)}|↓⟩`
        });
      }
      this.atualizarPainel();
    },

    alternarPainel: function () {
      this.painelAberto = !this.painelAberto;
      this.atualizarPainel();
    },

    atualizarPainel: function () {
      const painel = this.data.painel && this.data.painel.components['painel-texto'];
      if (!painel) return;
      const p = ESTADOS_SUPERPOSICAO[this.indice];
      painel.mostrar(this.painelAberto, 'Superposição', [
        'Antes de ser medido, o spin do elétron pode estar numa superposição: uma combinação de ↑ e ↓, cada um com um peso (amplitude).',
        `Neste estado, a chance de medir ↑ é ${pct(p)} e a de medir ↓ é ${pct(1 - p)}. Os lobos mostram esses pesos: quanto maior o lobo, maior a chance.`,
        'Superposição não é "estar nos dois ao mesmo tempo" nem "estar em um e não saber qual": é um estado próprio, que só vira ↑ ou ↓ quando é medido.'
      ]);
    },

    tick: function (tempo) {
      // Seta girando: o resultado ainda não está definido.
      this.eletron.seta.rotation.set(0, 0, (tempo / 1000) * 1.6);
    }
  });

  // ---------- Estação: medição ----------
  AFRAME.registerComponent('estacao-medicao', {
    schema: {
      painel: { type: 'selector' }, placa: { type: 'selector' },
      prefixo: { default: 'med-' }, pCima: { default: 0.7 }
    },

    init: function () {
      this.eletron = criarEletron(this.el.object3D, 0, 'Elétron');
      this.lobos = criarLobos(this.eletron);
      this.contagem = { cima: 0, baixo: 0 };
      this.resultado = null;
      this.painelAberto = false;

      // Histograma: duas barras à direita do elétron.
      const barra = (cor, x) => {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 1, 0.18),
          new THREE.MeshStandardMaterial({ color: cor, emissive: cor, emissiveIntensity: 0.6 })
        );
        b.position.set(x, -0.7, 0);
        b.scale.y = 0.001;
        this.el.object3D.add(b);
        const r = rotulo(x < 0.9 ? '↑' : '↓', cor, 0.12);
        r.position.set(x, -0.42, 0);
        this.el.object3D.add(r);
        return b;
      };
      this.barraCima = barra(CIANO, 0.75);
      this.barraBaixo = barra(MAGENTA, 1.05);

      ouvirAcoes(this, this.data.prefixo, {
        medir: this.medir, repetir: this.repetir, preparar: this.preparar, zerar: this.zerar, explicar: this.alternarPainel
      });
      this.preparar();
    },

    sortear: function () {
      return Math.random() < this.data.pCima;
    },

    // Mede o estado atual. Se já foi medido, o resultado se repete (o estado colapsou).
    medir: function () {
      if (this.resultado === null) {
        this.resultado = this.sortear();
        this.contar(this.resultado);
      }
      this.eletron.fixar(this.resultado, `Resultado: ${this.resultado ? '↑' : '↓'}`);
      this.lobos.definir(this.resultado ? 1 : 0);
      this.atualizar();
    },

    // Prepara e mede 20 vezes seguidas, somando no histograma.
    repetir: function () {
      for (let i = 0; i < 20; i++) this.contar(this.sortear());
      this.preparar();
    },

    zerar: function () {
      this.contagem = { cima: 0, baixo: 0 };
      this.preparar();
    },

    // Volta o elétron à superposição (o histograma é mantido).
    preparar: function () {
      this.resultado = null;
      this.eletron.soltar();
      this.lobos.definir(this.data.pCima);
      this.atualizar();
    },

    contar: function (cima) {
      if (cima) this.contagem.cima += 1; else this.contagem.baixo += 1;
    },

    atualizar: function () {
      const { cima, baixo } = this.contagem;
      const total = cima + baixo;
      const maior = Math.max(cima, baixo, 1);
      this.barraCima.scale.y = Math.max(0.001, (cima / maior) * 0.75);
      this.barraBaixo.scale.y = Math.max(0.001, (baixo / maior) * 0.75);
      this.barraCima.position.y = -0.32 + this.barraCima.scale.y / 2;
      this.barraBaixo.position.y = -0.32 + this.barraBaixo.scale.y / 2;
      if (this.data.placa) {
        this.data.placa.setAttribute('botao-neon', {
          texto: total ? `↑ ${cima} (${pct(cima / total)}) · ↓ ${baixo} (${pct(baixo / total)})` : 'Nenhuma medição ainda',
          subtexto: `Estado preparado: P(↑) ${pct(this.data.pCima)} · P(↓) ${pct(1 - this.data.pCima)}`
        });
      }
      this.atualizarPainel();
    },

    alternarPainel: function () {
      this.painelAberto = !this.painelAberto;
      this.atualizarPainel();
    },

    atualizarPainel: function () {
      const painel = this.data.painel && this.data.painel.components['painel-texto'];
      if (!painel) return;
      const p = this.data.pCima;
      const texto = this.resultado === null
        ? ['O elétron foi preparado em superposição, com P(↑) = ' + pct(p) + ' e P(↓) = ' + pct(1 - p) + '.',
           'Medir obriga o resultado a ser ↑ ou ↓, de forma aleatória, seguindo essas probabilidades.',
           'Use "Medir 20×" para preparar e medir várias vezes: o histograma se aproxima de ' + pct(p) + ' e ' + pct(1 - p) + '.']
        : [`A medição deu ${this.resultado ? '↑' : '↓'}. O estado colapsou: medir de novo dá sempre o mesmo resultado.`,
           'Para ter outra chance, é preciso preparar o elétron de novo, voltando à superposição.',
           'Cada medição isolada é imprevisível; só a repetição revela as probabilidades.'];
      painel.mostrar(this.painelAberto, 'Medição', texto);
    },

    tick: function (tempo) {
      if (this.resultado === null) this.eletron.seta.rotation.set(0, 0, (tempo / 1000) * 1.6);
    }
  });

  QL.fenomenos = { rotulo, criarEletron, ouvirAcoes, CIANO, MAGENTA };
})();

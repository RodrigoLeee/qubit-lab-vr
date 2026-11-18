// Qubit interativo representado na esfera de Bloch.
//
// Estado: |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}·sin(θ/2)|1⟩
//   θ (theta): ângulo a partir do polo |0⟩ (0° a 180°)
//   φ (phi):   ângulo no equador, como no ciclo trigonométrico (0° a 360°)
//
// Eixos de Bloch → eixos da cena (y para cima):
//   Bloch z (|0⟩) → cena +y
//   Bloch x (|+⟩) → cena +z (aponta para o jogador no início)
//   Bloch y (|+i⟩) → cena +x

(function () {
  const GRAU = Math.PI / 180;

  const ESTADOS = [
    { nome: '|0⟩', theta: 0, phi: 0 },
    { nome: '|1⟩', theta: 180, phi: 0 },
    { nome: '|+⟩', theta: 90, phi: 0 },
    { nome: '|−⟩', theta: 90, phi: 180 },
    { nome: '|+i⟩', theta: 90, phi: 90 },
    { nome: '|−i⟩', theta: 90, phi: 270 }
  ];

  // Ponto na esfera de Bloch convertido para coordenadas da cena.
  function bloch(theta, phi, r) {
    return new THREE.Vector3(
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta),
      r * Math.sin(theta) * Math.cos(phi)
    );
  }

  function anguloEntre(t1, p1, t2, p2) {
    const a = bloch(t1, p1, 1);
    const b = bloch(t2, p2, 1);
    return Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
  }

  function criarRotulo(texto, cor, altura) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 64px "Segoe UI", "Cambria Math", "Segoe UI Symbol", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = cor;
    ctx.shadowBlur = 14;
    ctx.fillStyle = cor;
    ctx.fillText(texto, 128, 64);
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: textura, transparent: true, depthWrite: false, fog: false
    }));
    sprite.scale.set(altura * 2, altura, 1);
    return sprite;
  }

  function criarLinha(cor, opacidade, tracejada) {
    const material = tracejada
      ? new THREE.LineDashedMaterial({ color: cor, dashSize: 0.015, gapSize: 0.01, transparent: true, opacity: opacidade, fog: false })
      : new THREE.LineBasicMaterial({ color: cor, transparent: true, opacity: opacidade, fog: false });
    const linha = new THREE.Line(new THREE.BufferGeometry(), material);
    linha.frustumCulled = false;
    return linha;
  }

  function definirPontos(linha, pontos) {
    linha.geometry.setFromPoints(pontos);
    if (linha.material.isLineDashedMaterial) linha.computeLineDistances();
  }

  AFRAME.registerComponent('qubit', {
    schema: {
      raio: { default: 0.27 },
      theta: { default: 0 },
      phi: { default: 0 },
      sensibilidadeMouse: { default: 0.5 },  // graus por pixel
      sensibilidadeControle: { default: 3 }  // multiplica o giro do controle
    },

    init: function () {
      this.theta = this.data.theta * GRAU;
      this.phi = this.data.phi * GRAU;
      this.arrastando = null;
      this.ultimoMouse = null;
      this.dirControle = new THREE.Vector3();
      this.quatControle = new THREE.Quaternion();
      this.alvo = this.sortearAlvo(-1);
      this.encontrado = false;

      this.construirEsfera();
      this.construirCicloTrigonometrico();
      this.construirVetorEstado();
      this.construirColisor();

      this.aoMoverMouse = this.aoMoverMouse.bind(this);
      this.aoSoltarMouse = this.aoSoltarMouse.bind(this);
      this.aoSoltarGatilho = this.aoSoltarGatilho.bind(this);
      window.addEventListener('mousemove', this.aoMoverMouse);
      window.addEventListener('mouseup', this.aoSoltarMouse);
      window.addEventListener('blur', this.aoSoltarMouse); // soltou o mouse fora da janela

      this.atualizar();
    },

    remove: function () {
      window.removeEventListener('mousemove', this.aoMoverMouse);
      window.removeEventListener('mouseup', this.aoSoltarMouse);
      window.removeEventListener('blur', this.aoSoltarMouse);
    },

    // ---------- Construção visual ----------

    construirEsfera: function () {
      const R = this.data.raio;
      const grupo = new THREE.Group();

      this.materialEsfera = new THREE.MeshStandardMaterial({
        color: '#00ffff', emissive: '#0088aa', emissiveIntensity: 0.4,
        transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide
      });
      grupo.add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), this.materialEsfera));

      // Malha de meridianos e paralelos.
      const corMalha = '#00ffff';
      for (let k = 0; k < 4; k++) {
        const phi = k * 45 * GRAU;
        const linha = criarLinha(corMalha, 0.18);
        const pts = [];
        for (let i = 0; i <= 64; i++) pts.push(bloch((i / 64) * 2 * Math.PI, phi, R));
        definirPontos(linha, pts);
        grupo.add(linha);
      }
      [45, 135].forEach((t) => {
        const linha = criarLinha(corMalha, 0.18);
        const pts = [];
        for (let i = 0; i <= 64; i++) pts.push(bloch(t * GRAU, (i / 64) * 2 * Math.PI, R));
        definirPontos(linha, pts);
        grupo.add(linha);
      });

      // Eixos.
      const eixos = [
        [bloch(0, 0, R * 1.15), bloch(Math.PI, 0, R * 1.15)],
        [bloch(Math.PI / 2, 0, R * 1.15), bloch(Math.PI / 2, Math.PI, R * 1.15)],
        [bloch(Math.PI / 2, Math.PI / 2, R * 1.15), bloch(Math.PI / 2, 3 * Math.PI / 2, R * 1.15)]
      ];
      eixos.forEach((par) => {
        const linha = criarLinha('#7fdfff', 0.6);
        definirPontos(linha, par);
        grupo.add(linha);
      });

      // Rótulos dos estados da base.
      ESTADOS.forEach((e) => {
        const distancia = e.theta === 90 ? R * 1.55 : R * 1.3;
        const rotulo = criarRotulo(e.nome, '#e6fbff', 0.07);
        rotulo.position.copy(bloch(e.theta * GRAU, e.phi * GRAU, distancia));
        grupo.add(rotulo);
      });

      this.el.setObject3D('esfera', grupo);
    },

    // Equador como ciclo trigonométrico: marcas a cada 15°, rótulos a cada 90°.
    construirCicloTrigonometrico: function () {
      const R = this.data.raio;
      const grupo = new THREE.Group();

      const anel = criarLinha('#00ffff', 0.95);
      const pts = [];
      for (let i = 0; i <= 128; i++) pts.push(bloch(Math.PI / 2, (i / 128) * 2 * Math.PI, R));
      definirPontos(anel, pts);
      grupo.add(anel);

      const marcas = [];
      for (let g = 0; g < 360; g += 15) {
        const tamanho = g % 90 === 0 ? 1.14 : g % 45 === 0 ? 1.09 : 1.05;
        marcas.push(bloch(Math.PI / 2, g * GRAU, R), bloch(Math.PI / 2, g * GRAU, R * tamanho));
      }
      const geoMarcas = new THREE.BufferGeometry().setFromPoints(marcas);
      grupo.add(new THREE.LineSegments(geoMarcas, new THREE.LineBasicMaterial({ color: '#00ffff', fog: false })));

      [0, 90, 180, 270].forEach((g) => {
        const rotulo = criarRotulo(g + '°', '#9ff', 0.045);
        const pos = bloch(Math.PI / 2, g * GRAU, R * 1.25);
        pos.y -= 0.035;
        rotulo.position.copy(pos);
        grupo.add(rotulo);
      });

      // Linhas que mudam com o estado.
      this.meridiano = criarLinha('#ff3df2', 0.35, true);  // círculo vertical onde θ é medido
      this.arcoTheta = criarLinha('#ff3df2', 1);
      this.arcoPhi = criarLinha('#ffd23d', 1);
      this.projecaoVertical = criarLinha('#ffd23d', 0.8, true); // ponta → equador (sen/cos)
      this.projecaoRaio = criarLinha('#ffd23d', 0.8);           // centro → projeção no equador
      [this.meridiano, this.arcoTheta, this.arcoPhi, this.projecaoVertical, this.projecaoRaio]
        .forEach((l) => grupo.add(l));

      this.rotuloTheta = criarRotulo('θ', '#ff3df2', 0.05);
      this.rotuloPhi = criarRotulo('φ', '#ffd23d', 0.05);
      grupo.add(this.rotuloTheta, this.rotuloPhi);

      this.el.setObject3D('ciclo', grupo);
    },

    construirVetorEstado: function () {
      const R = this.data.raio;
      const cor = '#ff3df2';
      const material = new THREE.MeshStandardMaterial({ color: cor, emissive: cor, emissiveIntensity: 0.9 });

      this.vetor = new THREE.Group();
      const comprimentoHaste = R - 0.05;
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, comprimentoHaste, 12), material);
      haste.position.y = comprimentoHaste / 2;
      const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.05, 16), material);
      ponta.position.y = comprimentoHaste + 0.025;
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), material);
      brilho.position.y = R;
      const centro = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), material);
      this.vetor.add(haste, ponta, brilho, centro);

      this.el.setObject3D('vetor', this.vetor);
    },

    // Esfera invisível um pouco maior, usada para detectar mouse e laser.
    construirColisor: function () {
      const colisor = document.createElement('a-sphere');
      colisor.setAttribute('radius', this.data.raio * 1.25);
      colisor.setAttribute('class', 'interagivel');
      colisor.setAttribute('material', 'transparent: true; opacity: 0; depthWrite: false');
      this.el.appendChild(colisor);

      colisor.addEventListener('mouseenter', () => this.destacar(true));
      colisor.addEventListener('mouseleave', () => { if (!this.arrastando) this.destacar(false); });
      colisor.addEventListener('mousedown', (e) => this.iniciarArraste(e));
    },

    destacar: function (ativo) {
      this.materialEsfera.opacity = ativo ? 0.22 : 0.12;
      this.materialEsfera.emissiveIntensity = ativo ? 0.9 : 0.4;
    },

    // ---------- Interação ----------

    iniciarArraste: function (e) {
      const cursor = e.detail && e.detail.cursorEl;
      if (!cursor || !QL.visivel(this.el.object3D)) return;

      if (cursor === this.el.sceneEl) {
        // Mouse no computador: pausa o olhar para o arraste girar só o qubit.
        this.arrastando = 'mouse';
        this.ultimoMouse = null;
        this.definirOlhar(false);
      } else {
        // Controle do headset: acompanha o giro do controle enquanto o gatilho estiver apertado.
        this.arrastando = cursor;
        this.angulosControle = this.lerAngulosControle(cursor);
        cursor.addEventListener('triggerup', this.aoSoltarGatilho);
      }
      this.destacar(true);
    },

    definirOlhar: function (ativo) {
      const camera = document.querySelector('[camera]');
      if (camera) camera.setAttribute('look-controls', 'enabled', ativo);
    },

    aoMoverMouse: function (e) {
      if (this.arrastando !== 'mouse') return;
      if (e.buttons === 0) { this.aoSoltarMouse(); return; } // botão já foi solto
      if (this.ultimoMouse) {
        const s = this.data.sensibilidadeMouse * GRAU;
        this.girar((e.clientX - this.ultimoMouse.x) * s, (e.clientY - this.ultimoMouse.y) * s);
      }
      this.ultimoMouse = { x: e.clientX, y: e.clientY };
    },

    aoSoltarMouse: function () {
      if (this.arrastando !== 'mouse') return;
      this.arrastando = null;
      this.definirOlhar(true);
      this.destacar(false);
    },

    aoSoltarGatilho: function (e) {
      e.target.removeEventListener('triggerup', this.aoSoltarGatilho);
      this.arrastando = null;
      this.destacar(false);
    },

    lerAngulosControle: function (el) {
      el.object3D.getWorldQuaternion(this.quatControle);
      this.dirControle.set(0, 0, -1).applyQuaternion(this.quatControle);
      return {
        yaw: Math.atan2(-this.dirControle.x, -this.dirControle.z),
        pitch: Math.asin(THREE.MathUtils.clamp(this.dirControle.y, -1, 1))
      };
    },

    // ---------- Mãos (hand tracking do Meta Quest): pinçar para pegar ----------
    //
    // Ao pinçar perto do qubit, a esfera "gruda" na mão: a cada movimento,
    // o vetor de estado gira o mesmo ângulo que a mão girou em volta do centro.

    centroERaioMundo: function () {
      const centro = new THREE.Vector3();
      const escala = new THREE.Vector3();
      this.el.object3D.getWorldPosition(centro);
      this.el.object3D.getWorldScale(escala);
      return { centro, raio: this.data.raio * escala.x };
    },

    iniciarPinca: function (mao, posMundo) {
      if (this.arrastando || !QL.visivel(this.el.object3D)) return false;
      const { centro, raio } = this.centroERaioMundo();
      const dir = posMundo.clone().sub(centro);
      const distancia = dir.length();
      if (distancia > raio * 1.6 || distancia < 0.03) return false;
      this.arrastando = mao;
      this.modoPinca = true;
      this.ultimaDirPinca = dir.normalize();
      this.destacar(true);
      return true;
    },

    moverPinca: function (mao, posMundo) {
      if (this.arrastando !== mao || !this.modoPinca) return;
      const { centro } = this.centroERaioMundo();
      const dir = posMundo.clone().sub(centro);
      if (dir.length() < 0.03) return; // mão no centro: direção indefinida
      dir.normalize();
      const giro = new THREE.Quaternion().setFromUnitVectors(this.ultimaDirPinca, dir);
      const v = bloch(this.theta, this.phi, 1).applyQuaternion(giro);
      this.theta = Math.acos(THREE.MathUtils.clamp(v.y, -1, 1));
      this.phi = (Math.atan2(v.x, v.z) + 2 * Math.PI) % (2 * Math.PI);
      this.ultimaDirPinca.copy(dir);
      this.atualizar();
    },

    soltarPinca: function (mao) {
      if (this.arrastando !== mao) return;
      this.arrastando = null;
      this.modoPinca = false;
      this.destacar(false);
    },

    tick: function () {
      if (!this.arrastando || this.arrastando === 'mouse' || this.modoPinca) return;
      const atual = this.lerAngulosControle(this.arrastando);
      let dYaw = atual.yaw - this.angulosControle.yaw;
      if (dYaw > Math.PI) dYaw -= 2 * Math.PI;
      if (dYaw < -Math.PI) dYaw += 2 * Math.PI;
      const dPitch = atual.pitch - this.angulosControle.pitch;
      this.angulosControle = atual;
      const k = this.data.sensibilidadeControle;
      this.girar(-dYaw * k, -dPitch * k);
    },

    // dPhi: giro em volta do eixo vertical (ciclo trigonométrico).
    // dTheta: inclinação do vetor em direção a |1⟩.
    girar: function (dPhi, dTheta) {
      this.theta = THREE.MathUtils.clamp(this.theta + dTheta, 0, Math.PI);
      this.phi = ((this.phi + dPhi) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      this.atualizar();
    },

    // ---------- Estado e desafio ----------

    sortearAlvo: function (anterior) {
      let i;
      do { i = Math.floor(Math.random() * ESTADOS.length); } while (i === anterior);
      return i;
    },

    atualizar: function () {
      const R = this.data.raio;
      const { theta, phi } = this;
      const ponta = bloch(theta, phi, R);

      // Vetor de estado.
      this.vetor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ponta.clone().normalize());

      // Meridiano do estado e arco de θ.
      const meridiano = [];
      for (let i = 0; i <= 96; i++) meridiano.push(bloch((i / 96) * 2 * Math.PI, phi, R));
      definirPontos(this.meridiano, meridiano);

      const arcoT = [];
      for (let i = 0; i <= 32; i++) arcoT.push(bloch((i / 32) * theta, phi, R * 0.45));
      definirPontos(this.arcoTheta, arcoT);
      this.rotuloTheta.position.copy(bloch(theta / 2, phi, R * 0.6));
      this.rotuloTheta.visible = theta > 8 * GRAU;

      // Arco de φ no equador (ciclo trigonométrico).
      const arcoP = [];
      for (let i = 0; i <= 48; i++) arcoP.push(bloch(Math.PI / 2, (i / 48) * phi, R * 0.35));
      definirPontos(this.arcoPhi, arcoP);
      this.rotuloPhi.position.copy(bloch(Math.PI / 2, phi / 2, R * 0.5));
      this.rotuloPhi.position.y += 0.03;
      this.rotuloPhi.visible = phi > 10 * GRAU && Math.sin(theta) > 0.05;

      // Projeção da ponta no plano do equador.
      const projecao = new THREE.Vector3(ponta.x, 0, ponta.z);
      definirPontos(this.projecaoVertical, [ponta, projecao]);
      definirPontos(this.projecaoRaio, [new THREE.Vector3(), projecao]);

      // Estado conhecido mais próximo e desafio.
      const tolerancia = 8 * GRAU;
      const proximo = ESTADOS.find((e) => anguloEntre(theta, phi, e.theta * GRAU, e.phi * GRAU) < tolerancia);
      const alvo = ESTADOS[this.alvo];
      if (!this.encontrado && anguloEntre(theta, phi, alvo.theta * GRAU, alvo.phi * GRAU) < tolerancia) {
        this.encontrado = true;
        setTimeout(() => {
          this.alvo = this.sortearAlvo(this.alvo);
          this.encontrado = false;
          this.atualizar();
        }, 2000);
      }

      this.emitirEstado(proximo);
    },

    emitirEstado: function (proximo) {
      this.el.emit('qubit-mudou', {
        theta: this.theta,
        phi: this.phi,
        proximo: proximo ? proximo.nome : null,
        alvo: ESTADOS[this.alvo].nome,
        encontrado: this.encontrado
      });
    }
  });

  // Liga os gestos de pinça de uma mão (hand-tracking-controls) ao qubit.
  AFRAME.registerComponent('pinca-qubit', {
    schema: { qubit: { type: 'selector' } },

    init: function () {
      this.pos = new THREE.Vector3();
      this.pegouQubit = false; // lido pelo 'andar-mao' para não teleportar ao soltar o qubit
      this.el.addEventListener('pinchstarted', (e) => {
        const q = this.qubit();
        this.pegouQubit = !!q && q.iniciarPinca(this.el, this.posicaoMundo(e.detail.position));
      });
      this.el.addEventListener('pinchmoved', (e) => {
        const q = this.qubit();
        if (q) q.moverPinca(this.el, this.posicaoMundo(e.detail.position));
      });
      this.el.addEventListener('pinchended', () => {
        const q = this.qubit();
        if (q) q.soltarPinca(this.el);
      });
    },

    qubit: function () {
      return this.data.qubit && this.data.qubit.components.qubit;
    },

    // A posição da pinça vem no espaço local da mão; converte para o mundo
    // (considera o jogador ter andado pela plataforma).
    posicaoMundo: function (local) {
      this.pos.copy(local);
      return this.el.object3D.localToWorld(this.pos);
    }
  });

  // Painel com a matemática do estado, sempre virado para o jogador.
  AFRAME.registerComponent('painel-qubit', {
    schema: { qubit: { type: 'selector' }, largura: { default: 1.1 } },

    init: function () {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1024;
      this.canvas.height = 640;
      this.ctx = this.canvas.getContext('2d');
      this.textura = new THREE.CanvasTexture(this.canvas);
      this.textura.colorSpace = THREE.SRGBColorSpace;

      const altura = this.data.largura * (this.canvas.height / this.canvas.width);
      const malha = new THREE.Mesh(
        new THREE.PlaneGeometry(this.data.largura, altura),
        new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, fog: false, side: THREE.DoubleSide })
      );
      this.el.setObject3D('mesh', malha);

      this.alvoOlhar = new THREE.Vector3();
      this.data.qubit.addEventListener('qubit-mudou', (e) => this.desenhar(e.detail));
      const q = this.data.qubit.components.qubit;
      if (q) q.emitirEstado(null);
    },

    tick: function () {
      const camera = this.el.sceneEl.camera;
      if (!camera) return;
      camera.getWorldPosition(this.alvoOlhar);
      const pos = new THREE.Vector3();
      this.el.object3D.getWorldPosition(pos);
      this.alvoOlhar.y = pos.y;
      this.el.object3D.lookAt(this.alvoOlhar);
    },

    desenhar: function (estado) {
      const { ctx, canvas } = this;
      const W = canvas.width, H = canvas.height;
      const { theta, phi } = estado;
      const alfa = Math.cos(theta / 2);
      const s = Math.sin(theta / 2);
      const betaRe = s * Math.cos(phi);
      const betaIm = s * Math.sin(phi);
      const p0 = alfa * alfa;
      const p1 = 1 - p0;
      const fonte = '"Segoe UI", "Cambria Math", "Segoe UI Symbol", sans-serif';
      const f = (n) => n.toFixed(3);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(3, 10, 30, 0.82)';
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(4, 4, W - 8, H - 8, 24);
      ctx.fill();
      ctx.stroke();

      ctx.textBaseline = 'top';
      ctx.fillStyle = '#00ffff';
      ctx.font = `bold 40px ${fonte}`;
      ctx.fillText('Qubit — esfera de Bloch', 40, 30);

      ctx.fillStyle = '#e6fbff';
      ctx.font = `34px ${fonte}`;
      ctx.fillText('|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)·sin(θ/2)|1⟩', 40, 95);

      ctx.font = `bold 38px ${fonte}`;
      ctx.fillStyle = '#ff3df2';
      ctx.fillText(`θ = ${(theta / GRAU).toFixed(1)}°`, 40, 160);
      ctx.fillStyle = '#ffd23d';
      ctx.fillText(`φ = ${(phi / GRAU).toFixed(1)}°`, 340, 160);

      ctx.fillStyle = '#e6fbff';
      ctx.font = `32px ${fonte}`;
      ctx.fillText(`α = ${f(alfa)}`, 40, 220);
      const sinal = betaIm < 0 ? '−' : '+';
      ctx.fillText(`β = ${f(betaRe)} ${sinal} ${f(Math.abs(betaIm))}i`, 340, 220);

      // Barras de probabilidade.
      const barras = [['P(0)', p0, '#00ffff'], ['P(1)', p1, '#ff3df2']];
      barras.forEach(([rotulo, p, cor], i) => {
        const y = 285 + i * 60;
        ctx.fillStyle = '#e6fbff';
        ctx.font = `30px ${fonte}`;
        ctx.fillText(rotulo, 40, y + 4);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(150, y, 640, 40);
        ctx.fillStyle = cor;
        ctx.fillRect(150, y, 640 * p, 40);
        ctx.fillStyle = '#e6fbff';
        ctx.fillText(`${(p * 100).toFixed(1)}%`, 810, y + 4);
      });

      ctx.font = `bold 34px ${fonte}`;
      ctx.fillStyle = estado.proximo ? '#7dff9b' : '#6c86a8';
      ctx.fillText(`Estado: ${estado.proximo || '—'}`, 40, 420);

      if (estado.encontrado) {
        ctx.fillStyle = '#7dff9b';
        ctx.fillText(`✓ Encontrou ${estado.alvo}!`, 40, 480);
      } else {
        ctx.fillStyle = '#ffd23d';
        ctx.fillText(`Desafio: encontre ${estado.alvo}`, 40, 480);
      }

      ctx.fillStyle = '#8fb3d9';
      ctx.font = `26px ${fonte}`;
      ctx.fillText('Gire o qubit: arraste (mouse), gatilho (controle) ou pince com a mão', 40, 560);

      this.textura.needsUpdate = true;
    }
  });
})();

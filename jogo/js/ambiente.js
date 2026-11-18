// Componentes do ambiente: céu, chão neon e movimentação do jogador.

// Céu noturno: estrelas espalhadas no hemisfério de cima.
AFRAME.registerComponent('estrelas', {
  schema: { quantidade: { default: 600 }, raio: { default: 80 } },
  init: function () {
    const { quantidade, raio } = this.data;
    const posicoes = new Float32Array(quantidade * 3);
    for (let i = 0; i < quantidade; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.95);
      posicoes[i * 3] = raio * Math.sin(phi) * Math.cos(theta);
      posicoes[i * 3 + 1] = raio * Math.cos(phi);
      posicoes[i * 3 + 2] = raio * Math.sin(phi) * Math.sin(theta);
    }
    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
    const material = new THREE.PointsMaterial({ color: '#ffffff', size: 0.4, sizeAttenuation: true, fog: false });
    this.el.setObject3D('mesh', new THREE.Points(geometria, material));
  }
});

// Chão quadriculado neon.
AFRAME.registerComponent('grade-neon', {
  schema: { tamanho: { default: 10 }, divisoes: { default: 10 }, cor: { default: '#00ffff' } },
  init: function () {
    const { tamanho, divisoes, cor } = this.data;
    const grade = new THREE.GridHelper(tamanho, divisoes, cor, cor);
    grade.material.transparent = true;
    grade.material.opacity = 0.9;
    this.el.setObject3D('mesh', grade);
  }
});

// Mantém o jogador em cima da plataforma e fora do pedestal do qubit.
// Fica no "rig" do jogador; empurra o rig de volta quando a câmera sai dos limites.
AFRAME.registerComponent('limites-plataforma', {
  schema: {
    meiaLargura: { default: 4.6 },
    raioObstaculo: { default: 0.55 }
  },
  init: function () {
    this.posCamera = new THREE.Vector3();
  },
  tick: function () {
    const camera = this.el.sceneEl.camera;
    if (!camera) return;
    camera.getWorldPosition(this.posCamera);
    const { meiaLargura, raioObstaculo } = this.data;
    const p = this.posCamera;
    let dx = 0, dz = 0;

    if (p.x > meiaLargura) dx = meiaLargura - p.x;
    if (p.x < -meiaLargura) dx = -meiaLargura - p.x;
    if (p.z > meiaLargura) dz = meiaLargura - p.z;
    if (p.z < -meiaLargura) dz = -meiaLargura - p.z;

    // Pedestal do qubit fica no centro (0, 0).
    const dist = Math.hypot(p.x, p.z);
    if (dist < raioObstaculo && dist > 0.0001) {
      const empurrar = raioObstaculo - dist;
      dx += (p.x / dist) * empurrar;
      dz += (p.z / dist) * empurrar;
    }

    if (dx !== 0 || dz !== 0) {
      this.el.object3D.position.x += dx;
      this.el.object3D.position.z += dz;
    }
  }
});

// Apontar e clicar no chão para andar até lá.
// - Computador: clique no chão (arrastar para olhar em volta não conta como clique).
// - Headset: aponte o laser do controle para o chão e aperte o gatilho.
// Um anel ciano mostra onde o jogador vai parar.
AFRAME.registerComponent('andar-clicando', {
  schema: {
    rig: { type: 'selector' },
    marcador: { type: 'selector' },
    duracao: { default: 400 } // ms do deslize no computador; no VR é instantâneo
  },

  init: function () {
    this.raios = new Set();
    this.mouseDown = null;
    this.mouseMoveu = false;
    this.anim = null;
    this.posCamera = new THREE.Vector3();

    this.el.addEventListener('raycaster-intersected', (e) => this.raios.add(e.detail.el));
    this.el.addEventListener('raycaster-intersected-cleared', (e) => this.raios.delete(e.detail.el));
    this.el.addEventListener('click', (e) => this.aoClicar(e));

    window.addEventListener('mousedown', (e) => {
      this.mouseDown = { x: e.clientX, y: e.clientY };
      this.mouseMoveu = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (this.mouseDown && Math.hypot(e.clientX - this.mouseDown.x, e.clientY - this.mouseDown.y) > 6) {
        this.mouseMoveu = true;
      }
    });
  },

  aoClicar: function (e) {
    const cursor = e.detail && e.detail.cursorEl;
    const intersecao = e.detail && e.detail.intersection;
    if (!intersecao) return;
    // No computador, ignora o "clique" que foi na verdade um arraste para olhar.
    if (cursor === this.el.sceneEl && this.mouseMoveu) return;
    this.irPara(intersecao.point);
  },

  irPara: function (destino) {
    const rig = this.data.rig.object3D;
    this.el.sceneEl.camera.getWorldPosition(this.posCamera);
    const dx = destino.x - this.posCamera.x;
    const dz = destino.z - this.posCamera.z;

    if (this.el.sceneEl.is('vr-mode')) {
      // Teleporte instantâneo: deslizar no VR costuma dar enjoo.
      rig.position.x += dx;
      rig.position.z += dz;
      return;
    }
    this.anim = {
      inicio: performance.now(),
      de: rig.position.clone(),
      para: new THREE.Vector3(rig.position.x + dx, rig.position.y, rig.position.z + dz)
    };
  },

  tick: function () {
    // Deslize suave no computador.
    if (this.anim) {
      const t = Math.min((performance.now() - this.anim.inicio) / this.data.duracao, 1);
      const suave = t * t * (3 - 2 * t);
      this.data.rig.object3D.position.lerpVectors(this.anim.de, this.anim.para, suave);
      if (t >= 1) this.anim = null;
    }

    // Marcador no ponto apontado.
    const marcador = this.data.marcador;
    if (!marcador) return;
    let ponto = null;
    for (const raio of this.raios) {
      const comp = raio.components.raycaster;
      const intersecao = comp && comp.getIntersection(this.el);
      // Só mostra se o chão for o primeiro objeto na mira (não o qubit).
      if (intersecao && comp.intersections[0] === intersecao) { ponto = intersecao.point; break; }
    }
    marcador.object3D.visible = !!ponto;
    if (ponto) marcador.object3D.position.set(ponto.x, 0.02, ponto.z);
  }
});

// Andar sem controles (hand tracking): estique a mão apontando para o chão,
// aparece um raio e o anel de destino; pince e solte para teleportar.
// O raio sai de um ponto perto do ombro e passa pela mão, como o ponteiro do Quest.
AFRAME.registerComponent('andar-mao', {
  schema: {
    chao: { type: 'selector' },        // entidade com 'andar-clicando'
    lado: { default: 1 },              // 1 = mão direita, -1 = esquerda
    limite: { default: 4.6 }
  },

  init: function () {
    this.cabeca = new THREE.Vector3();
    this.ombro = new THREE.Vector3();
    this.mao = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.direita = new THREE.Vector3();
    this.matriz = new THREE.Matrix4();
    this.alvo = null;
    this.armado = false;

    const cena = this.el.sceneEl;
    this.marcador = document.createElement('a-ring');
    this.marcador.setAttribute('rotation', '-90 0 0');
    this.marcador.setAttribute('radius-inner', 0.14);
    this.marcador.setAttribute('radius-outer', 0.2);
    this.marcador.setAttribute('material', 'color: #00ffff; side: double; transparent: true; opacity: 0.9; shader: flat');
    this.marcador.setAttribute('visible', false);
    cena.appendChild(this.marcador);

    this.raio = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
      new THREE.LineBasicMaterial({ color: '#00ffff', transparent: true, opacity: 0.7 })
    );
    this.raio.frustumCulled = false;
    this.raio.visible = false;
    cena.object3D.add(this.raio);

    this.el.addEventListener('pinchstarted', () => {
      // Espera o 'pinca-qubit' decidir se a pinça pegou o qubit.
      setTimeout(() => {
        const pinca = this.el.components['pinca-qubit'];
        this.armado = !!this.alvo && !(pinca && pinca.pegouQubit);
      }, 0);
    });
    this.el.addEventListener('pinchended', () => {
      if (this.armado && this.alvo && this.data.chao) {
        this.data.chao.components['andar-clicando'].irPara(this.alvo);
      }
      this.armado = false;
    });
  },

  tick: function () {
    const maos = this.el.components['hand-tracking-controls'];
    const camera = this.el.sceneEl.camera;
    this.alvo = null;

    if (maos && maos.hasPoses && camera) {
      // Junta da base do dedo indicador (índice 6): estável mesmo pinçando.
      this.mao.setFromMatrixPosition(this.matriz.fromArray(maos.jointPoses, 6 * 16));
      this.el.object3D.localToWorld(this.mao);

      camera.getWorldPosition(this.cabeca);
      this.direita.set(1, 0, 0).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
      this.direita.y = 0;
      this.direita.normalize();
      this.ombro.copy(this.cabeca).addScaledVector(this.direita, 0.15 * this.data.lado);
      this.ombro.y -= 0.25;

      this.dir.subVectors(this.mao, this.ombro);
      const bracoEsticado = this.dir.length() > 0.3;
      this.dir.normalize();

      // Interseção do raio com o chão (y = 0).
      if (bracoEsticado && this.dir.y < -0.1) {
        const t = -this.mao.y / this.dir.y;
        const x = this.mao.x + this.dir.x * t;
        const z = this.mao.z + this.dir.z * t;
        if (Math.abs(x) < this.data.limite && Math.abs(z) < this.data.limite && t < 12) {
          this.alvo = new THREE.Vector3(x, 0, z);
        }
      }
    }

    const ativo = !!this.alvo;
    this.marcador.object3D.visible = ativo;
    this.raio.visible = ativo;
    if (ativo) {
      this.marcador.object3D.position.set(this.alvo.x, 0.02, this.alvo.z);
      const pos = this.raio.geometry.attributes.position;
      pos.setXYZ(0, this.mao.x, this.mao.y, this.mao.z);
      pos.setXYZ(1, this.alvo.x, 0.02, this.alvo.z);
      pos.needsUpdate = true;
      this.marcador.setAttribute('material', 'opacity', this.armado ? 1 : 0.6);
    }
  }
});

// Andar no headset com o analógico do controle esquerdo.
AFRAME.registerComponent('andar-vr', {
  schema: { rig: { type: 'selector' }, velocidade: { default: 1.6 } },
  init: function () {
    this.eixo = { x: 0, y: 0 };
    this.frente = new THREE.Vector3();
    this.direita = new THREE.Vector3();
    this.el.addEventListener('thumbstickmoved', (e) => {
      this.eixo.x = e.detail.x;
      this.eixo.y = e.detail.y;
    });
  },
  tick: function (t, dt) {
    const { x, y } = this.eixo;
    if (Math.hypot(x, y) < 0.15 || !this.data.rig) return;
    const camera = this.el.sceneEl.camera;
    camera.getWorldDirection(this.frente);
    this.frente.y = 0;
    this.frente.normalize();
    this.direita.crossVectors(this.frente, camera.up).normalize();
    const passo = this.data.velocidade * (dt / 1000);
    const pos = this.data.rig.object3D.position;
    pos.addScaledVector(this.frente, -y * passo);
    pos.addScaledVector(this.direita, x * passo);
  }
});

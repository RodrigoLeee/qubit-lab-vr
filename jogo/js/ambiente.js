// Componentes do ambiente: céu, plataforma neon e movimentação do jogador.

// ---------- Utilitários compartilhados ----------
window.QL = window.QL || {};

// Distingue "clique" de mouse de um arraste para olhar em volta.
QL.mouse = { down: null, moveu: false };
window.addEventListener('mousedown', (e) => {
  QL.mouse.down = { x: e.clientX, y: e.clientY };
  QL.mouse.moveu = false;
});
window.addEventListener('mousemove', (e) => {
  const d = QL.mouse.down;
  if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) QL.mouse.moveu = true;
});
QL.cliqueValido = function (e, sceneEl) {
  const cursor = e.detail && e.detail.cursorEl;
  return !(cursor === sceneEl && QL.mouse.moveu);
};

// Um objeto só está "no jogo" se ele e todos os pais estiverem visíveis.
QL.visivel = function (obj) {
  while (obj) {
    if (!obj.visible) return false;
    obj = obj.parent;
  }
  return true;
};

// Vibração curta no controle que confirmou a ação (retorno tátil).
QL.vibrar = function (cursorEl, intensidade, duracao) {
  const tc = cursorEl && cursorEl.components && cursorEl.components['tracked-controls'];
  const gamepad = tc && tc.controller && tc.controller.gamepad;
  const motor = gamepad && gamepad.hapticActuators && gamepad.hapticActuators[0];
  if (motor && motor.pulse) motor.pulse(intensidade || 0.4, duracao || 50);
};

// Leva o jogador até um ponto do chão.
QL.irPara = function (destino) {
  const rig = document.querySelector('#jogador');
  if (rig) rig.components['mover-jogador'].irPara(destino);
};

// ---------- Céu ----------

// Estrelas espalhadas no hemisfério de cima.
AFRAME.registerComponent('estrelas', {
  schema: { quantidade: { default: 800 }, raio: { default: 90 } },
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

// ---------- Plataforma ----------

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

// Plataforma completa: bloco escuro, grade de 1 m, borda neon e chão clicável.
AFRAME.registerComponent('plataforma-neon', {
  schema: { tamanho: { default: 10 }, cor: { default: '#00ffff' } },
  init: function () {
    const { tamanho: t, cor } = this.data;
    const criar = (tag, attrs) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      this.el.appendChild(el);
      return el;
    };

    criar('a-box', {
      position: '0 -0.25 0', width: t, height: 0.5, depth: t,
      material: 'color: #030712; roughness: 0.9'
    });
    criar('a-entity', { 'grade-neon': `tamanho: ${t}; divisoes: ${t}; cor: ${cor}`, position: '0 0.005 0' });

    const borda = `color: ${cor}; emissive: ${cor}; emissiveIntensity: 1`;
    const m = t / 2;
    criar('a-box', { position: `0 0.01 ${m}`, width: t + 0.05, height: 0.04, depth: 0.05, material: borda });
    criar('a-box', { position: `0 0.01 ${-m}`, width: t + 0.05, height: 0.04, depth: 0.05, material: borda });
    criar('a-box', { position: `${m} 0.01 0`, width: 0.05, height: 0.04, depth: t + 0.05, material: borda });
    criar('a-box', { position: `${-m} 0.01 0`, width: 0.05, height: 0.04, depth: t + 0.05, material: borda });

    // Área clicável (invisível) para andar apontando.
    criar('a-plane', {
      class: 'chao', rotation: '-90 0 0', position: '0 0.01 0', width: t - 0.6, height: t - 0.6,
      material: 'transparent: true; opacity: 0; depthWrite: false',
      'andar-clicando': 'marcador: #marcador-destino'
    });
  }
});

// ---------- Jogador ----------

// Move o rig do jogador: deslize suave no computador, teleporte instantâneo no VR.
AFRAME.registerComponent('mover-jogador', {
  schema: { duracao: { default: 400 } },
  init: function () {
    this.anim = null;
    this.posCamera = new THREE.Vector3();
  },

  irPara: function (destino) {
    const rig = this.el.object3D;
    this.el.sceneEl.camera.getWorldPosition(this.posCamera);
    const dx = destino.x - this.posCamera.x;
    const dz = destino.z - this.posCamera.z;
    if (this.el.sceneEl.is('vr-mode')) {
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

  // Coloca o jogador no ponto inicial de um mapa, olhando para frente (−z).
  teleportarPara: function (x, z) {
    this.anim = null;
    this.el.object3D.position.set(x, 0, z);
    const camEl = this.el.querySelector('[camera]');
    if (camEl && !this.el.sceneEl.is('vr-mode')) {
      camEl.object3D.position.x = 0;
      camEl.object3D.position.z = 0;
      const look = camEl.components['look-controls'];
      if (look && look.yawObject) {
        look.yawObject.rotation.y = 0;
        look.pitchObject.rotation.x = 0;
      }
    }
  },

  tick: function () {
    if (!this.anim) return;
    const t = Math.min((performance.now() - this.anim.inicio) / this.data.duracao, 1);
    const suave = t * t * (3 - 2 * t);
    this.el.object3D.position.lerpVectors(this.anim.de, this.anim.para, suave);
    if (t >= 1) this.anim = null;
  }
});

// Mantém o jogador em cima da plataforma e fora do obstáculo central (pilar do qubit).
// Os valores são trocados pelo gerenciador de mapas.
AFRAME.registerComponent('limites-plataforma', {
  schema: {
    meiaLargura: { default: 4.6 },
    raioObstaculo: { default: 0 }
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

// ---------- Andar apontando ----------

// Clique no chão (mouse ou laser do controle) para andar até lá.
// Só age se este chão estiver ativo (com a classe 'chao').
AFRAME.registerComponent('andar-clicando', {
  schema: { marcador: { type: 'selector' } },

  init: function () {
    this.raios = new Set();
    this.el.addEventListener('raycaster-intersected', (e) => this.raios.add(e.detail.el));
    this.el.addEventListener('raycaster-intersected-cleared', (e) => this.raios.delete(e.detail.el));
    this.el.addEventListener('click', (e) => {
      if (!this.ativo()) return;
      const intersecao = e.detail && e.detail.intersection;
      if (!intersecao || !QL.cliqueValido(e, this.el.sceneEl)) return;
      QL.vibrar(e.detail.cursorEl);
      QL.irPara(intersecao.point);
    });
  },

  ativo: function () {
    return this.el.classList.contains('chao');
  },

  tick: function () {
    const marcador = this.data.marcador;
    if (!marcador || !this.ativo()) return;
    let ponto = null;
    for (const raio of this.raios) {
      const comp = raio.components.raycaster;
      const intersecao = comp && comp.getIntersection(this.el);
      // Só mostra se o chão for o primeiro objeto na mira (não um botão ou o qubit).
      if (intersecao && comp.intersections[0] === intersecao) { ponto = intersecao.point; break; }
    }
    marcador.object3D.visible = !!ponto;
    if (ponto) marcador.object3D.position.set(ponto.x, 0.02, ponto.z);
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

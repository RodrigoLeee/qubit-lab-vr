// Menu, botões neon e troca entre mapas.
//
// Todos os mapas ficam na mesma cena; só o mapa ativo fica visível e clicável.
// Assim a troca é instantânea e o jogador continua no modo VR.

(function () {
  const FONTE = '"Segoe UI", "Cambria Math", "Segoe UI Symbol", sans-serif';
  const CLASSES_CLICAVEIS = ['interagivel', 'chao', 'botao'];

  // Botão (ou placa) neon com texto desenhado em canvas.
  // Com a classe 'botao' ele é clicável; sem ela, serve só de placa.
  // acao: "mapa:<nome>" troca de mapa.
  AFRAME.registerComponent('botao-neon', {
    schema: {
      texto: { default: '' },
      subtexto: { default: '' },
      largura: { default: 1.2 },
      altura: { default: 0.6 },
      cor: { default: '#00ffff' },
      tamanhoTexto: { default: 0.32 }, // fração da altura do canvas
      acao: { default: '' }
    },

    init: function () {
      const { largura, altura } = this.data;
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1024;
      this.canvas.height = Math.round(1024 * (altura / largura));
      this.ctx = this.canvas.getContext('2d');
      this.textura = new THREE.CanvasTexture(this.canvas);
      this.textura.colorSpace = THREE.SRGBColorSpace;

      const malha = new THREE.Mesh(
        new THREE.PlaneGeometry(largura, altura),
        new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, fog: false, side: THREE.DoubleSide })
      );
      this.el.setObject3D('mesh', malha);

      this.fontes = new Set(); // quem está apontando (mouse, laser, mão)
      this.desenhar(false);

      this.el.addEventListener('mouseenter', (e) => this.hover(e.detail && e.detail.cursorEl, true));
      this.el.addEventListener('mouseleave', (e) => this.hover(e.detail && e.detail.cursorEl, false));
      this.el.addEventListener('click', (e) => this.aoClicar(e));
    },

    hover: function (fonte, ativo) {
      if (ativo) this.fontes.add(fonte || 'cursor');
      else this.fontes.delete(fonte || 'cursor');
      this.desenhar(this.fontes.size > 0);
    },

    aoClicar: function (e) {
      if (!this.el.classList.contains('botao')) return;
      if (!QL.cliqueValido(e, this.el.sceneEl)) return;
      const acao = this.data.acao;
      if (acao.startsWith('mapa:')) {
        this.fontes.clear();
        this.desenhar(false);
        this.el.sceneEl.components.mapas.ir(acao.slice(5));
      }
    },

    desenhar: function (destacado) {
      const { ctx, canvas } = this;
      const { texto, subtexto, cor, tamanhoTexto } = this.data;
      const W = canvas.width, H = canvas.height;
      const raio = Math.min(W, H) * 0.12;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.shadowColor = cor;
      ctx.shadowBlur = destacado ? 40 : 22;
      ctx.fillStyle = destacado ? 'rgba(0, 255, 255, 0.22)' : 'rgba(3, 10, 30, 0.85)';
      ctx.strokeStyle = cor;
      ctx.lineWidth = destacado ? 14 : 9;
      ctx.beginPath();
      ctx.roundRect(16, 16, W - 32, H - 32, raio);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = cor;
      ctx.shadowBlur = 18;
      ctx.fillStyle = destacado ? '#ffffff' : cor;
      // Reduz a fonte até o texto caber na largura do botão (com margem).
      let tamanho = Math.round(H * tamanhoTexto);
      ctx.font = `bold ${tamanho}px ${FONTE}`;
      while (ctx.measureText(texto).width > W * 0.82 && tamanho > 10) {
        tamanho -= 2;
        ctx.font = `bold ${tamanho}px ${FONTE}`;
      }
      const yTexto = subtexto ? H * 0.42 : H * 0.5;
      ctx.fillText(texto, W / 2, yTexto);

      if (subtexto) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = destacado ? '#e6fbff' : '#8fdcff';
        let tamanhoSub = Math.round(tamanho * 0.42);
        ctx.font = `${tamanhoSub}px ${FONTE}`;
        while (ctx.measureText(subtexto).width > W * 0.86 && tamanhoSub > 10) {
          tamanhoSub -= 2;
          ctx.font = `${tamanhoSub}px ${FONTE}`;
        }
        ctx.fillText(subtexto, W / 2, H * 0.72);
      }
      this.textura.needsUpdate = true;
    }
  });

  // Configuração de um mapa: tamanho da plataforma, ponto inicial e obstáculo central.
  AFRAME.registerComponent('mapa', {
    schema: {
      nome: { type: 'string' },
      tamanho: { default: 10 },
      inicioZ: { default: 3 },
      obstaculo: { default: 0 } // raio bloqueado no centro (pilar do qubit)
    }
  });

  // Gerenciador de mapas, no <a-scene>.
  AFRAME.registerComponent('mapas', {
    schema: { inicial: { default: 'menu' } },

    init: function () {
      this.atual = null;
      const comecar = () => this.ir(this.data.inicial);
      if (this.el.hasLoaded) comecar();
      else this.el.addEventListener('loaded', comecar);
    },

    ir: function (nome) {
      const mapas = Array.from(this.el.querySelectorAll('[mapa]'));
      const destino = mapas.find((m) => m.getAttribute('mapa').nome === nome);
      if (!destino) return;

      mapas.forEach((m) => {
        const ativo = m === destino;
        m.object3D.visible = ativo;
        if (ativo) this.ativarClicaveis(m);
        else this.desativarClicaveis(m);
      });

      const cfg = destino.getAttribute('mapa');
      const rig = document.querySelector('#jogador');
      rig.setAttribute('limites-plataforma', {
        meiaLargura: cfg.tamanho / 2 - 0.4,
        raioObstaculo: cfg.obstaculo
      });
      rig.components['mover-jogador'].teleportarPara(0, cfg.inicioZ);

      this.atual = nome;
      this.el.emit('mapa-mudou', { nome });
    },

    // Tira a classe clicável dos elementos de mapas escondidos (o raycaster ignora)
    // e guarda qual era, para devolver quando o mapa voltar.
    desativarClicaveis: function (mapa) {
      mapa.querySelectorAll(CLASSES_CLICAVEIS.map((c) => '.' + c).join(',')).forEach((el) => {
        const classe = CLASSES_CLICAVEIS.find((c) => el.classList.contains(c));
        el.dataset.classeAtiva = classe;
        el.classList.remove(classe);
      });
    },

    ativarClicaveis: function (mapa) {
      mapa.querySelectorAll('[data-classe-ativa]').forEach((el) => {
        el.classList.add(el.dataset.classeAtiva);
        delete el.dataset.classeAtiva;
      });
    }
  });
})();

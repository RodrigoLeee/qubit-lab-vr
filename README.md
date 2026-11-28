# Inteli - Instituto de Tecnologia e Liderança

<p align="center">
<a href="https://www.inteli.edu.br/"><b>Inteli - Instituto de Tecnologia e Liderança</b></a>
</p>

# Qubit Lab VR

## Integrante:
- Rodrigo Hu Tchie Lee

## Descrição

O **Qubit Lab VR** é uma experiência em **realidade virtual** para aprender computação quântica por imersão. Em vez de fórmulas e diagramas numa tela, o usuário entra em salas neon, vê os fenômenos quânticos acontecendo ao seu redor e interage com qubits usando os controles do Meta Quest 3, ou o mouse no navegador do computador.

O jogo começa em um menu neon com **três modos**:

| Modo | Nome | Objetivo | Status |
|---|---|---|---|
| 1 | **Quântico** | Estações de superposição, medição e emaranhamento | Funcional |
| 2 | **Qubit** | Girar um qubit na esfera de Bloch e encontrar estados, com o ciclo trigonométrico no equador | Funcional |
| 3 | **Circuit** | Montar circuitos quânticos com portas (H, X, Z, CNOT…) | Em desenvolvimento |

**Por que VR?** Em 2D, faria mais sentido criar diagramas e simuladores voltados a cálculo. Aqui o objetivo é o **aprendizado imersivo**: estar "dentro" da escala atômica permite sentir os conceitos (estados, rotações, correlações) em vez de só calculá-los.

## Links

- [Documentação do projeto](docs/projeto.md)
- [Ficha técnica da experiência imersiva](docs/ficha_tecnica.md)
- [Registro diário (log)](docs/registro_log.md)
- [Plano de testes](docs/testes.md)
- [Diretrizes de assets](docs/assets.md)
- [Interação: mirar e confirmar](docs/interacao.md)
- [Moodboard](docs/moodboard.md)
- [Mapa de interação](docs/mapa_interacao.md)
- Página de testes de interação: `jogo/testes.html`

## Estrutura de pastas

```
|--> docs
  | projeto.md
  | ficha_tecnica.md
  | registro_log.md
  | testes.md
  | assets.md
  | interacao.md
  | moodboard.md
  | mapa_interacao.md
  |--> imagens
|--> jogo
  | index.html
  | testes.html
  |--> js
|--> 01-aframe-minimo
|--> 02-caddy-local
|--> 03-caddy-docker
|--> 04-aframe-caddy-docker
| LICENSE
| README.md
```

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- **README.md:** arquivo que serve como guia e explicação geral sobre o projeto (o mesmo que você está lendo agora).
- **docs:** todos os documentos do projeto (documentação, ficha técnica e registro diário). A pasta `imagens` guarda as capturas de cada versão.
- **jogo:** código-fonte da experiência em A-Frame (`index.html` monta a cena; `js/` tem os componentes de ambiente, qubit e menu).
- **01 a 04:** exemplos do template de origem, do A-Frame mínimo até o A-Frame servido pelo Caddy em Docker com HTTPS.

## Jogar

O jogo é publicado no GitHub Pages a cada merge na `main`:

**https://rodrigoleee.github.io/qubit-lab-vr/**

No Meta Quest 3, abra o endereço no navegador, toque em **VR** e use os controles: aponte o laser e aperte o gatilho. Para sair, use o botão **SAIR DO VR** no chão de cada sala.

## Dispositivo testado

| Dispositivo | Navegador | Interação | Acesso |
|---|---|---|---|
| Meta Quest 3 | Navegador do Meta Quest | Controles (laser + gatilho; analógico para andar) | GitHub Pages, com HTTPS |
| Computador (Windows) | Chrome | Mouse e teclado (WASD) | Servidor local e GitHub Pages |

## Prova de conceito

A prova de conceito, entregue em 27/11/2026, verifica se a **experiência em WebXR roda direto no navegador do Meta Quest 3**, sem instalar nada, e qual entrada funciona melhor para mirar e confirmar.

| Pergunta | Como foi demonstrado | Resultado |
|---|---|---|
| O A-Frame com WebXR roda no Quest pelo navegador? | Jogo publicado no GitHub Pages, com HTTPS, aberto no navegador do Quest e jogado em VR | Funciona: menu, salas Quântico e Qubit, teleporte, vibração do controle e botão SAIR DO VR |
| Qual entrada usar para mirar e confirmar? | [Página de testes](https://rodrigoleee.github.io/qubit-lab-vr/testes.html) com olhar com tempo, aceno de cabeça, controle e PC, no desafio de lançar a bolinha pela mesma função `lancar()` | Controle como interação principal; pinça com as mãos removida ([`testes.md`](docs/testes.md)) |
| Dá para lançar sem usar as mãos? | Olhar com tempo e aceno de cabeça na página de testes | Funciona, mas o olhar com tempo é lento; as duas entradas seguem como alternativa sem mãos ([`interacao.md`](docs/interacao.md)) |

## Decisões do projeto

| Data | Decisão | Motivo |
|---|---|---|
| 17/11/2026 | Qubit com diâmetro de 3/5 da altura do jogador, sobre um pilar de 3/5 da altura | Com 1/3 da altura o qubit ficava baixo e pequeno; nessa escala ele fica na altura do olhar |
| 23/11/2026 | Formas geométricas para conceitos e dados; modelos 3D só para objetos físicos e manipuláveis | A geometria em código segue fiel à matemática do estado; modelos entram onde a forma precisa ser reconhecida ou pega ([`assets.md`](docs/assets.md)) |
| 25/11/2026 | Espaço organizado em salas (Menu, Quântico, Qubit e Circuito) | A ordem do percurso passa a ser a ordem do aprendizado ([`mapa_interacao.md`](docs/mapa_interacao.md)) |
| 26/11/2026 | Controle como interação principal; pinça com as mãos removida | Nos testes, a pinça misturava clicar e teleportar e o olhar com tempo era lento ([`testes.md`](docs/testes.md)) |
| 26/11/2026 | Olhar com tempo e aceno de cabeça mantidos na página de testes | Alternativa sem mãos, como pede o desafio de interação da disciplina ([`interacao.md`](docs/interacao.md)) |
| 26/11/2026 | Publicação no GitHub Pages a cada merge na `main` | HTTPS válido e acesso pelo Quest em qualquer rede, sem configurar servidor ou certificado |

## Configuração para desenvolvimento

Instale o git e clone este repositório:

```bash
git clone https://github.com/RodrigoLeee/qubit-lab-vr.git
```

**No computador** (visualização com mouse e teclado), sirva a pasta `jogo` com qualquer servidor estático, por exemplo:

```bash
python -m http.server 8001 --directory jogo
```

Acesse http://localhost:8001.

**Com HTTPS local** (Caddy em Docker, no padrão do exemplo [`04-aframe-caddy-docker`](04-aframe-caddy-docker)), na raiz do projeto:

```bash
docker compose up --build
```

Acesse https://localhost:8443. Para abrir no headset pela rede local, siga a seção "Acessando de outro dispositivo (headset)" do README do exemplo 04.

### Tecnologias

- [A-Frame 1.8](https://aframe.io) (WebXR sobre three.js)
- JavaScript, organizado em componentes A-Frame
- [Caddy](https://caddyserver.com) e Docker para servir com HTTPS

## Histórico de lançamentos

* 0.4.0 - 26/11/2026
    * Modo Quântico com as estações de superposição, medição e emaranhamento
    * Página de testes de interação e testes no Meta Quest 3
    * Controle como interação principal, a partir dos testes; interação por pinça removida
    * Vibração ao confirmar e botão SAIR DO VR em cada sala
    * Publicação no GitHub Pages

* 0.3.0 - 18/11/2026
    * Menu neon com os modos Quântico, Qubit e Circuit
    * Plataformas grandes para os modos Quântico e Circuit (em desenvolvimento)
    * Botão **MENU** no chão de cada mapa
    * Clique em botões com mouse, controle ou apontando e pinçando com a mão
* 0.2.0 - 17/11/2026
    * Ambiente noturno com plataforma neon
    * Qubit interativo na esfera de Bloch, com ciclo trigonométrico, painel de estado e desafio
    * Interação e movimentação com mouse, controles e mãos (hand tracking do Meta Quest 3)
    * Documentação: ficha técnica e projeto
* 0.1.0 - 16/11/2026
    * Criação do repositório a partir do template Caddy + A-Frame
    * Definição da ideia e do contexto com a disciplina de computação quântica

## Licença/License

O código-fonte e os exemplos herdados do template [Repositorio-Template-Caddy-AFrame](https://github.com/Murilo-ZC/Repositorio-Template-Caddy-AFrame), de Murilo Zanini de Carvalho, seguem a licença MIT (ver [LICENSE](LICENSE)).

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/RodrigoLeee/qubit-lab-vr">Qubit Lab VR</a> by <span property="cc:attributionName">Inteli, Rodrigo Hu Tchie Lee</span> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>

# Inteli - Instituto de Tecnologia e Liderança

<p align="center">
<a href="https://www.inteli.edu.br/"><b>Inteli - Instituto de Tecnologia e Liderança</b></a>
</p>

# Qubit Lab VR

## Integrante:
- Rodrigo Hu Tchie Lee

## Descrição

O **Qubit Lab VR** é uma experiência em **realidade virtual** para aprender computação quântica por imersão. Em vez de fórmulas e diagramas numa tela, o usuário entra em um ambiente neon em escala atômica, vê os fenômenos quânticos acontecendo ao seu redor e interage com qubits com as próprias mãos, no Meta Quest 3 ou no navegador do computador.

O jogo começa em um menu neon com **três modos**:

| Modo | Nome | Objetivo | Status |
|---|---|---|---|
| 1 | **Quântico** | Visualizar fenômenos quânticos (superposição, emaranhamento, medição) | Em desenvolvimento |
| 2 | **Qubit** | Girar um qubit na esfera de Bloch e encontrar estados, com o ciclo trigonométrico no equador | Funcional |
| 3 | **Circuit** | Montar circuitos quânticos com portas (H, X, Z, CNOT…) | Em desenvolvimento |

**Por que VR?** Em 2D, faria mais sentido criar diagramas e simuladores voltados a cálculo. Aqui o objetivo é o **aprendizado imersivo**: estar "dentro" da escala atômica permite sentir os conceitos (estados, rotações, correlações) em vez de só calculá-los.

## Links

- [Documentação do projeto](docs/projeto.md)
- [Ficha técnica da experiência imersiva](docs/ficha_tecnica.md)
- [Registro diário (log)](docs/registro_log.md)
- [Plano de testes](docs/testes.md)
- [Diretrizes de assets](docs/assets.md)

## Estrutura de pastas

```
|--> docs
  | projeto.md
  | ficha_tecnica.md
  | registro_log.md
  | testes.md
  | assets.md
  |--> imagens
|--> jogo
  | index.html
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

**No headset (Meta Quest 3)**, o WebXR exige HTTPS. Use o Caddy em Docker do exemplo [`04-aframe-caddy-docker`](04-aframe-caddy-docker), copiando o conteúdo de `jogo/` para a pasta `site/`, e acesse pelo IP do computador na rede (passo a passo no README do exemplo 04).

### Tecnologias

- [A-Frame 1.8](https://aframe.io) (WebXR sobre three.js)
- JavaScript, organizado em componentes A-Frame
- [Caddy](https://caddyserver.com) e Docker para servir com HTTPS

## Histórico de lançamentos

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

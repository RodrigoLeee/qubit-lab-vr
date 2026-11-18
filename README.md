# Qubit Lab VR

Experiência em **realidade virtual** para aprender computação quântica por imersão. Em vez de fórmulas e diagramas numa tela, o usuário entra em um ambiente em escala atômica, vê os fenômenos quânticos acontecendo ao seu redor e interage com qubits com as próprias mãos.

> Projeto desenvolvido para a disciplina de computação quântica, usando A-Frame (WebXR) servido pelo Caddy.

## A ideia

O jogo tem **três modos**, que vão do entendimento conceitual à construção:

| Modo | Nome | Objetivo |
|---|---|---|
| 1 | **Observar** — fenômenos quânticos | Ensino teórico: visualizar superposição, emaranhamento, medição e interferência como eventos no espaço ao redor do usuário. |
| 2 | **Brincar** — interagir com qubits | Pegar, rotacionar e manipular um qubit (esfera de Bloch) e ver em tempo real como o estado e as probabilidades de medição mudam. |
| 3 | **Construir** — montar circuitos | Encaixar portas quânticas (H, X, Z, CNOT, …) em fios de qubits, executar o circuito e observar o resultado. |

### Por que VR?

Em 2D, faria mais sentido criar diagramas, desenhos matemáticos e simuladores voltados a cálculo. O objetivo aqui é outro: **aprendizado imersivo**. Estar "dentro" da escala atômica, num ambiente elétrico e tecnológico, permite sentir os conceitos (estados, rotações, correlações) em vez de só calculá-los.

Mais detalhes em [`ficha_tecnica.md`](ficha_tecnica.md).

## Tecnologias

- [A-Frame](https://aframe.io): framework web para cenas 3D/VR (WebXR), roda no navegador e no headset.
- [Caddy](https://caddyserver.com): servidor web com HTTPS local, necessário para o WebXR funcionar no headset.
- Docker (opcional): empacota a cena e o servidor numa imagem.

## Como rodar

O repositório partiu de um template com quatro exemplos independentes, do mais simples ao mais completo:

| Diretório | O que mostra | Precisa de |
|---|---|---|
| [`01-aframe-minimo`](01-aframe-minimo) | Cena A-Frame aberta direto no navegador | Só o navegador |
| [`02-caddy-local`](02-caddy-local) | Servir uma página estática com o Caddy instalado na máquina | Caddy |
| [`03-caddy-docker`](03-caddy-docker) | O mesmo servidor, usando a imagem oficial do Caddy no Docker | Docker |
| [`04-aframe-caddy-docker`](04-aframe-caddy-docker) | A cena A-Frame empacotada em uma imagem Docker com o Caddy | Docker |

Cada diretório tem um `README.md` com o passo a passo. O exemplo 02 responde em http://localhost:8080; os exemplos 03 e 04 (Docker) respondem em https://localhost:8443.

## Documentação do projeto

- [`ficha_tecnica.md`](ficha_tecnica.md): ficha técnica da experiência imersiva.
- [`registro_log.md`](registro_log.md): registro diário do desenvolvimento.

## Autor

Rodrigo Hu Tchie Lee

## Créditos

Baseado no template [Repositorio-Template-Caddy-AFrame](https://github.com/Murilo-ZC/Repositorio-Template-Caddy-AFrame), de Murilo Zanini de Carvalho (licença MIT).

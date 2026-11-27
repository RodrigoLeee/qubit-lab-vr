# Moodboard — Qubit Lab VR

Atmosfera da experiência: um **laboratório quântico noturno, elétrico e tecnológico**, organizado em salas de teste. As principais referências são a estética de luz e grade de *Tron: Legacy* e a organização em câmaras de teste de *Portal 2*.

## Referências do próprio projeto

| Plataforma neon (versão 1) | Qubit na esfera de Bloch (versão 2) |
|---|---|
| ![Plataforma neon sob o céu noturno](imagens/v1-plataforma-neon.png) | ![Qubit na esfera de Bloch com o painel de estado](imagens/v2-qubit-bloch.png) |

## Referências externas

### Tron: Legacy (2010, dir. Joseph Kosinski)

O mundo digital do filme é a principal referência de **cor, luz e forma**.

- **Cor e luz:** fundo quase preto e luz que nasce dos próprios objetos, em linhas finas de ciano. Uma segunda cor, quente, marca o que se opõe ou se destaca.
- **Materiais:** superfícies escuras e lisas, com filetes de luz nas bordas; pouca textura, muito contraste.
- **Forma:** arquitetura geométrica e limpa, com a grade como base do mundo e o horizonte se perdendo em névoa.
- **Som:** trilha eletrônica, pulsante e atmosférica, que reforça a sensação de estar dentro de uma máquina.

### Portal 2 (Valve, 2011, engine Source)

As câmaras de teste do jogo são a principal referência de **organização do espaço, sinalização e forma de guiar o jogador**.

- **Câmaras de teste:** cada sala é um desafio fechado, com começo, objetivo e saída claros; o percurso é uma sequência de salas.
- **Sinalização:** na entrada de cada câmara, uma placa com o número da sala e pictogramas dos elementos que o jogador vai encontrar.
- **Cor e luz:** painéis claros e limpos contrastando com estrutura escura de metal; luz e cor indicam o que é interativo e por onde seguir. Duas cores opostas (azul e laranja) distinguem as duas pontas de uma mesma mecânica.
- **Materiais:** painéis modulares, superfícies de laboratório e estruturas de luz sólida, como pontes e grades de luz.
- **Narrativa ambiental:** o estado das salas e os avisos do laboratório contam a história sem interromper o jogo.
- **Guiar o jogador:** marcos visuais, linhas de visada e a primeira vista de cada sala mostram o objetivo antes de qualquer instrução.
- **Som:** uma voz que acompanha os testes e sons curtos e claros para cada ação.

## Como as referências aparecem no Qubit Lab VR

| Elemento | Tron: Legacy | Portal 2 | No Qubit Lab VR |
|---|---|---|---|
| Espaço | Mundo em grade | Sequência de câmaras de teste | Salas (Menu, Quântico, Qubit, Circuito) sobre plataformas com grade de 1 m |
| Cor | Ciano sobre preto, com cor quente de contraste | Duas cores opostas para as duas pontas de uma mecânica | Ciano para estrutura e ↑; magenta para o estado, as ações e ↓ |
| Luz | Luz que nasce dos objetos | Luz indica o que é interativo | Bordas, grade, botões e vetores emissivos; botões acendem ao serem mirados |
| Sinalização | — | Placa com número e pictogramas na entrada | Títulos numerados das estações (1. Superposição, 2. Medição, 3. Emaranhamento) |
| Narrativa | Mundo dentro da máquina | Laboratório que testa o jogador | Laboratório de testes quânticos: cada estação é um experimento com desafio e explicação |
| Guiar o jogador | Linhas de luz e horizonte | Marcos, linhas de visada e primeira vista | Primeira vista de frente para o conteúdo, estações em arco e bordas neon como limite |
| Som | Trilha eletrônica pulsante | Voz e sons curtos por ação | Zumbido elétrico ambiente e efeitos curtos ao confirmar, medir e acertar (planejado) |

As referências orientam a direção de arte; nenhum elemento, personagem, modelo ou som dessas obras é reproduzido no projeto.

## Palavras-chave

**Noturno · elétrico · neon · laboratório · câmara de teste · translúcido · preciso · curioso**

- O ambiente é calmo e escuro; a energia vem dos objetos que brilham.
- O que é conceito quântico é luz (linhas, anéis, esferas translúcidas); o que é estrutura é sólido e escuro (plataformas, pilares, bancada).

## Paleta

| Função | Cor | Hex |
|---|---|---|
| Céu noturno | Azul-marinho | `#071640` |
| Fundo profundo / neblina | Azul quase preto | `#020818` |
| Plataformas e pilares | Preto azulado | `#030712` |
| Grade, bordas e destaques | Ciano neon | `#00FFFF` / `#2EF2F2` |
| Vetor de estado, ações e alertas | Magenta neon | `#FF3DF2` / `#FF6BF2` |
| Ângulo φ e avisos | Amarelo | `#FFD23D` |
| Texto | Branco azulado | `#E6FBFF` |

## Luz e materiais

- **Luz:** ambiente fraca e azulada, com um brilho ciano saindo do centro de cada plataforma; neblina exponencial dando profundidade ao horizonte.
- **Materiais:** emissivos para tudo que representa informação; translúcidos para as esferas (o qubit e a nuvem dos elétrons); foscos e escuros para a estrutura.
- **Estrelas:** pontos brancos fixos no hemisfério superior, fora da neblina.

## Forma

- Geometria limpa e minimalista: grades quadriculadas de 1 m, anéis, cilindros e esferas.
- Assets modelados apenas para objetos físicos e manipuláveis, como a bancada e as portas do Circuito (ver [`assets.md`](assets.md)).
- Painéis com bordas arredondadas, fundo escuro translúcido e texto em ciano e branco.

## Movimento e som

- **Movimento:** pulsos lentos (o feixe entre os elétrons, o spin girando), sem piscar rápido.
- **Som:** zumbido elétrico ambiente baixo e efeitos curtos ao confirmar, medir e acertar.

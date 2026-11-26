# Interação — Qubit Lab VR

Como o usuário mira e confirma no Qubit Lab VR. Desde 26/11/2026, a **interação principal é o controle do Meta Quest 3**, decisão tomada a partir dos testes de interação (ver [`testes.md`](testes.md), Teste 2).

## 1. Mirar e confirmar

Toda interação tem duas partes: **mirar** diz "o quê" e **confirmar** diz "agora".

| Entrada | Mirar | Confirmar | Onde está |
|---|---|---|---|
| **Controle do Quest** (principal) | Raio do controle (`laser-controls`) | Gatilho, com vibração ao confirmar | Jogo e página de testes |
| Olhar com tempo | Direção da cabeça (anel a 1 m dos olhos) | Olhar o alvo por 1,5 s; o anel magenta enche durante a espera | Página de testes |
| Aceno de cabeça (alternativa sem mãos) | Direção da cabeça | Baixar e voltar a cabeça rapidamente | Página de testes |
| PC | Mouse ou direção da câmera | Clique ou barra de espaço | Jogo e página de testes |
| Mãos (pinça) | Raio estimado do ombro pela mão | Pinça | Removida em 26/11/2026 |

## Decisão: controle como interação principal

**Origem:** a rodada de testes no Meta Quest 3 (26/11/2026) comparou controle, mãos (pinça) e olhar com tempo.

- **Mãos (pinça):** o mesmo gesto servia para clicar e para teleportar, e ao tentar acionar um botão o jogador era teleportado. Um gesto com duas funções não deixa o sistema separar a intenção.
- **Olhar com tempo:** confiável, mas a espera de 1,5 s a cada confirmação deixa a experiência lenta.
- **Controle:** separa mirar (o raio) de confirmar (o gatilho) e cada função tem seu botão. Funcionou bem em todas as salas.

**Fundamento:** pela relação de **incorporação** (Ihde), uma técnica bem ajustada se junta ao corpo e recua da atenção; e pelo **hábito motor** (Merleau-Ponty), apertar um gatilho é um saber que o corpo já tem. O controle deixa de ser objeto de atenção e o foco fica nos fenômenos quânticos.

**Consequências no projeto**
- O rastreamento de mãos foi removido do jogo.
- Toda confirmação com o controle gera uma vibração curta (retorno tátil).
- Cada sala ganhou o botão **SAIR DO VR** no chão, ao lado do **MENU**.
- O olhar com tempo e o aceno de cabeça seguem na página de testes como alternativa sem mãos.

## 2. Alternativa sem mãos: aceno de cabeça

- **Mirar:** o olhar, o mesmo anel do cursor com tempo.
- **Confirmar:** um aceno, ou seja, a cabeça desce pelo menos 10° e volta em até 0,7 s.
- **Por quê:** olhar não é intenção. O tempo do fuse confirma só por a pessoa estar olhando; o aceno é um gesto deliberado e mais rápido, que não depende de esperar.
- **Força:** no lançamento, a amplitude do aceno define a velocidade da bolinha (acenos maiores, lançamentos mais fortes).
- **Convivência com o fuse:** as duas confirmações ficam ativas. O aceno confirma antes do fuse terminar; quem prefere não fazer gestos confirma pelo tempo.

### Modalidade de referência

A revisão de Monteiro et al. sobre interação sem mãos em VR aponta voz, olhar e cabeça como as modalidades mais estudadas. O aceno de cabeça se encaixa em **gestos de cabeça**: a mesma direção usada para mirar também gera o gesto que confirma, sem acessório e sem microfone.

**Como o aceno lança a bolinha:** a pessoa olha para o alvo (mira) e acena (confirma). O sistema chama `lancar(origem, destino)` com a origem no anel do olhar, o destino no ponto em que o raio toca o alvo e a velocidade proporcional à amplitude do aceno.

## 3. Detecção da entrada

1. **Tem VR?** `navigator.xr.isSessionSupported('immersive-vr')`.
2. **Entrou no VR?** Eventos `enter-vr` e `exit-vr` na cena.
3. **Tem controle?** `controllerconnected` desliga o olhar e o raio do controle assume; `controllerdisconnected` devolve o olhar.

O jogo sempre começa no olhar, que funciona no Quest, no celular e no PC, e só uma entrada fica ativa por vez.

## 4. Decisões de design

| Decisão | Valor | Motivo |
|---|---|---|
| Tempo do fuse | 1,5 s | Longo o bastante para não confirmar só de passar o olhar; curto o bastante para não cansar |
| Pausa após confirmar pelo olhar | 1 s | Evita que, ao teleportar ou abrir um painel, o olhar acione o que estiver na frente |
| Área clicável dos pontos de teleporte | Até 1 m de altura | Exige olhar para baixo; olhar o horizonte não teleporta |
| Chão clicável pelo olhar | Não | Olhar em volta não pode mover o jogador |
| Deslocamento sem mãos | Pontos de teleporte | Teleporte instantâneo no VR, para evitar enjoo |
| Interação principal | Controle (laser + gatilho) | Resultado dos testes: mira estável, confirmação clara e funções separadas por botão |
| Retorno tátil | Vibração de 50 ms ao confirmar | Confirma a ação sem depender da visão |

## 5. Página de testes

A página [`jogo/testes.html`](../jogo/testes.html) reúne as interações em uma plataforma de 40 × 40 m:

- **Demonstração de emaranhamento:** dois elétrons e os botões *Medir*, *O que está acontecendo?* e *Reiniciar*.
- **Desafio da bolinha:** um alvo que recebe lançamentos de todas as entradas pela mesma função `lancar()`, com placar de acertos por entrada.
- **Lousa desenhada com a cabeça:** a caneta é ligada e desligada por um botão confirmado pelo olhar ou pelo aceno, e o centro da visão desenha.
- **Registro do teste:** uma placa mostra a entrada ativa, o modo (PC ou VR), a última ação, a entrada usada e o tempo entre mirar e confirmar.

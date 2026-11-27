# Ficha Técnica — Qubit Lab VR

Ficha técnica da experiência imersiva: modos de jogo, eixos da experiência (domínio, sentir, teste da tela, moldura, corpo e risco) e dados captados do usuário. Cada seção separa o que está **implementado** do que está **planejado**.

## Resumo

| Campo | Descrição |
|---|---|
| **Nome** | Qubit Lab VR |
| **Autor** | Rodrigo Hu Tchie Lee |
| **Tipo** | Jogo educativo de visualização em realidade virtual |
| **Público** | Estudantes da disciplina de computação quântica |
| **Dispositivo-alvo** | Meta Quest 3 via navegador (WebXR), com os controles como interação principal; fallback para desktop (mouse e teclado) |
| **Tecnologias** | A-Frame 1.8 (WebXR / three.js), JavaScript, Caddy e Docker para servir com HTTPS |
| **Modos** | 1. Quântico (fenômenos) · 2. Qubit (esfera de Bloch) · 3. Circuit (circuitos) |
| **Navegação** | Menu principal neon; cada modo em um mapa próprio, com botão MENU no chão para voltar |

## Modos de jogo

### Menu principal

**Implementado**
- Plataforma neon de 10 × 10 m com o título "QUBIT LAB VR" e três botões: **1. Quântico**, **2. Qubit** e **3. Circuit**.
- Os botões acendem ao serem apontados e são acionados com o laser e o gatilho do controle (no PC, com o mouse), com vibração ao confirmar.
- A troca de mapa acontece na mesma cena, sem sair do modo VR.

### 1. Quântico — fenômenos quânticos

**Implementado**
- Mapa próprio: plataforma de 40 × 40 m com três estações em arco, cada uma com título, botões e painel de explicação:
  - **Superposição:** um elétron com dois lobos (↑ e ↓) cujo tamanho mostra a chance de cada resultado; o botão *Mudar estado* alterna entre 50/50, 80/20 e 20/80.
  - **Medição:** um elétron preparado com P(↑) = 70%; *Medir* colapsa o estado (medir de novo repete o resultado), *Medir 20×* preenche um histograma que se aproxima de 70/30, e *Preparar* volta à superposição.
  - **Emaranhamento:** dois elétrons correlacionados; ao medir, os resultados saem sempre opostos, e o texto deixa claro que nada viaja de um para o outro.

**Planejado**
- **Interferência:** caminhos de amplitude que se reforçam ou se cancelam, como ondas de luz.

### 2. Qubit — esfera de Bloch

**Implementado**
- Qubit representado como uma **esfera de Bloch** de 0,96 m de diâmetro (3/5 da altura do jogador), sobre um pilar neon de 0,96 m.
- Vetor de estado |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}·sin(θ/2)|1⟩ e os estados da base marcados: |0⟩, |1⟩, |+⟩, |−⟩, |+i⟩ e |−i⟩.
- **Ciclo trigonométrico no equador:** marcas a cada 15°, rótulos em 0°, 90°, 180° e 270°, arcos dos ângulos θ e φ e projeção da ponta do vetor no plano do equador.
- **Painel de estado** ao lado da esfera, sempre virado para o jogador: θ, φ, amplitudes α e β e probabilidades P(0) e P(1).
- **Desafio:** o painel sorteia um estado da base para o jogador encontrar; ao chegar a menos de 8° dele, o acerto é confirmado e um novo alvo é sorteado.
- Rotação do qubit com o controle: apontar o laser para a esfera e segurar o gatilho (no PC, arrastar com o mouse).

**Planejado**
- Medição do qubit na própria esfera de Bloch, reaproveitando a estação de medição do modo Quântico.

### 3. Circuit — montar circuitos

**Implementado**
- Mapa próprio: plataforma de 40 × 40 m com as mecânicas de movimentação e o botão MENU no chão.

**Planejado**
- Bancada com "fios" de qubits, onde o usuário encaixa portas quânticas (H, X, Y, Z, CNOT).
- Execução do circuito mostrando o estado passando pelas portas e o resultado final.
- Exportação do circuito montado como código Qiskit / OpenQASM.
- Desafios progressivos, como "crie um estado de Bell" ou "faça o qubit sempre medir 1".

## Eixos da experiência

### 1. Domínio — onde a experiência acontece

**Implementado**
- Um mundo **virtual, elétrico e tecnológico**: plataformas neon flutuando sob um céu noturno azul-escuro e estrelado, com neblina ao longe.
- Cada modo acontece em um mapa próprio, ligado aos outros pelo menu principal.

**Planejado**
- Ambientação de cada mapa conforme o modo: um campo de partículas (Quântico) e um laboratório-bancada (Circuit).

### 2. Sentir — o que, e para quê

- O usuário deve **se sentir elétrico**: energia, brilho e movimento.
- **Para quê:** a sensação de estar cercado por algo vivo e instável traduz a natureza probabilística da física quântica. O usuário deve sentir **curiosidade e controle**: o mundo é estranho, mas responde às suas ações.

**Implementado**
- Estética neon: grade e bordas em ciano, vetor de estado e destaques em magenta, botões que acendem ao serem apontados.

**Planejado**
- Partículas e linhas de energia, som ambiente de zumbido elétrico e efeitos sonoros ao clicar, pegar e medir.
- Vibração do controle ao medir ou acertar um desafio.

### 3. Teste da tela — por que não numa tela

- Em 2D, faria mais sentido criar diagramas, desenhos matemáticos e simuladores para interagir. Esses recursos acabam orientados principalmente para **realizar cálculos**, e não para o **aprendizado imersivo geral**.
- Em VR, conceitos tridimensionais como a esfera de Bloch e as rotações viram objetos que o usuário aponta, pega e gira com o controle na mão. A **intuição espacial** é o ganho que a tela não oferece.

### 4. Moldura — o que fica dentro, e se ela se mostra

**Implementado**
- **Dentro da cena:** o qubit, a esfera de Bloch, o ciclo trigonométrico e o painel de estado ao lado da esfera.
- **Navegação:** a troca de modo é feita pelo menu principal e pelo botão MENU no chão de cada mapa, sem menus sobrepostos à cena.
- **Ela se mostra?** Parcialmente. O ambiente é contínuo, mas as plataformas têm bordas neon visíveis e os painéis exibem a matemática do estado, deixando claro que é um **laboratório de aprendizado**, não uma simulação literal do átomo (ver item 6).

### 5. Corpo — onde fica e o que pode fazer

**Implementado**
- **Onde fica:** em pé sobre a plataforma, em escala humana (olhos a 1,6 m), com o qubit na altura do olhar.
- **O que pode fazer:**
  - **Olhar** ao redor em 360° e andar fisicamente pelo espaço (roomscale).
  - **Pegar e girar** o qubit com o controle (laser + gatilho) ou, no PC, com o mouse.
  - **Apontar e clicar** em botões e no chão com o laser e o gatilho do controle, com vibração ao confirmar.
  - **Sair do VR** pelo botão no chão de cada sala, ao lado do MENU.
  - **Se mover** pela plataforma: teleporte apontando para o chão (instantâneo no VR, para evitar enjoo), WASD no computador ou analógico do controle.
- **Limites:** o jogador não sai da plataforma nem atravessa o pilar do qubit.
- **Conforto:** a experiência pode ser feita em pé parado ou sentado, com os movimentos de câmera sempre controlados pelo usuário.

**Planejado**
- **Arrastar e encaixar** portas quânticas no modo Circuit.

### 6. Risco — como serviria para enganar

- **Falsa literalidade:** qubits não são esferas brilhantes e o emaranhamento não é um "feixe de energia". A visualização é uma **metáfora**, e o usuário pode sair achando que é literalmente assim.
- **Comunicação mais rápida que a luz:** a animação do emaranhamento pode sugerir que uma informação "viaja" de um qubit ao outro, o que é falso.
- **Superposição como "estar nos dois ao mesmo tempo":** a simplificação popular é enganosa.
- **Encantamento sem aprendizado:** o visual "elétrico" pode impressionar sem ensinar.

**Implementado**
- O painel de estado exibe as **amplitudes e probabilidades** junto da representação visual, diferenciando o que é metáfora (a esfera) do que é dado (a matemática).
- O **desafio** do modo Qubit transforma a observação em uma tarefa com objetivo.

**Planejado**
- Avisos curtos do tipo "isto é uma representação" nos fenômenos do modo Quântico.
- No emaranhamento, mostrar que o resultado é correlacionado, mas aleatório, e que não permite transmitir mensagens.
- Cada fenômeno terminando com uma pergunta ou um desafio rápido.

## Dados captados do usuário

Mapeamento do que o headset capta do corpo do usuário e de como o jogo usa esses dados. A base é o **Meta Quest 3** via navegador (WebXR).

### Implementado

| Sinal | O que é captado | Como o jogo usa |
|---|---|---|
| **Cabeça (headset)** | Posição e rotação da cabeça em 6 graus de liberdade: para onde o usuário olha e onde está no espaço | Câmera da cena (olhar em 360° e andar fisicamente), painel sempre virado para o usuário, limites da plataforma e orientação dos painéis |
| **Controles** | Posição e rotação dos controles, gatilho e analógico | Laser para apontar, gatilho para clicar e girar o qubit, analógico para andar; o controle vibra ao confirmar |

### Planejado — dados derivados (sem sensor extra)

- **Altura do usuário:** altura da cabeça em relação ao chão, para ajustar o pilar e o qubit à altura de cada pessoa.
- **Alcance do braço:** maior distância entre o controle e a cabeça, para posicionar objetos ao alcance.
- **Mão dominante:** qual controle aponta e confirma mais.
- **Atenção:** para onde a cabeça aponta e por quanto tempo (o Quest 3 não tem rastreamento ocular; a direção da cabeça é a aproximação do olhar).
- **Conforto e enjoo:** movimentos bruscos de cabeça, pausas longas ou saída antecipada como indicadores de desconforto.

### Planejado — longo prazo

- **Métricas de aprendizado:** tempo e número de tentativas para encontrar cada estado no desafio, e quais estados geram mais erros.
- **Mapa de calor do olhar:** quais partes da esfera de Bloch e do painel recebem mais atenção.
- **Rastreamento ocular e facial:** apenas em headsets com esses sensores (por exemplo, o Meta Quest Pro); não disponível no Quest 3.
- **Ambiente real (realidade mista):** detecção de paredes, mesas e profundidade para posicionar o qubit no espaço do usuário.

### Privacidade

- Os dados são usados **só em tempo real**, dentro do navegador: nada é gravado nem enviado para servidor.
- Dados de movimento do corpo podem identificar uma pessoa (o padrão de movimento da cabeça e dos braços é quase único). Qualquer coleta de métricas deve:
  - pedir **consentimento** explícito antes de coletar;
  - guardar apenas dados **agregados ou anonimizados** (por exemplo, "tempo para encontrar |+⟩", não a trajetória completa da cabeça);
  - seguir a **LGPD**, informando o que é coletado, para quê e por quanto tempo.

## O que mudou na ficha

| Data | Campo | Mudança | Por quê |
|---|---|---|---|
| 25/11/2026 | Domínio e Moldura | O espaço passou a ser organizado em **salas** (Menu, Quântico, Qubit e Circuit), cada uma com uma função e ligada às outras pelo menu | A planta e o percurso deixam o espaço legível na ordem em que o corpo o atravessa |
| 26/11/2026 | Corpo | A interação principal passou a ser o **controle**; a pinça com as mãos foi removida | Nos testes, a pinça misturava clicar e teleportar, o olhar com tempo era lento e o controle funcionou bem em todas as salas |
| 26/11/2026 | Modos | As três estações do modo Quântico (superposição, medição e emaranhamento) passaram de planejadas a implementadas | Primeira versão jogável do conteúdo conceitual |

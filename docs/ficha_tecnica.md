# Ficha Técnica — Qubit Lab VR

Ficha técnica da experiência imersiva, organizada nos eixos de **imersão, perspectiva, panorama e headset**.

## Resumo

| Campo | Descrição |
|---|---|
| **Nome** | Qubit Lab VR |
| **Autor** | Rodrigo Hu Tchie Lee |
| **Tipo** | Jogo educativo de visualização em realidade virtual |
| **Público** | Estudantes da disciplina de computação quântica |
| **Plataforma** | Headset VR via navegador (WebXR), com fallback para desktop |
| **Tecnologias** | A-Frame, Caddy, Docker (opcional) |
| **Modos** | 1. Observar (fenômenos) · 2. Brincar (qubits) · 3. Construir (circuitos) |

## Modos de jogo

### 1. Observar — fenômenos quânticos (ensino teórico)
Visualização guiada dos conceitos centrais:
- **Superposição:** um qubit que "vibra" entre |0⟩ e |1⟩ até ser medido.
- **Medição:** o estado colapsa visualmente num resultado, e repetir mostra a distribuição de probabilidades.
- **Emaranhamento:** dois qubits ligados por um feixe de energia, em que medir um define o outro, mesmo distantes.
- **Interferência:** caminhos de amplitude que se reforçam ou se cancelam, como ondas de luz.

### 2. Brincar — interagir com qubits
- O qubit é representado como uma **esfera de Bloch** que o usuário pode pegar e rotacionar.
- Ao girar, o usuário vê em tempo real o estado (α|0⟩ + β|1⟩) e as probabilidades de medir 0 ou 1.
- Botão de "medir" para colapsar o estado e comparar com a previsão.

### 3. Construir — montar circuitos
- Bancada com "fios" de qubits, onde o usuário encaixa portas quânticas (H, X, Y, Z, CNOT).
- Executar o circuito mostra o estado passando pelas portas e o resultado final.
- Desafios progressivos, como "crie um estado de Bell" ou "faça o qubit sempre medir 1".

## Eixos da experiência

### 1. Domínio — onde a experiência acontece
- A experiência acontece **no nível atômico**: o usuário vê o mundo da perspectiva de um átomo, embora haja elementos que vão além do átomo (interfaces, painéis, portas quânticas).
- O ambiente é **virtual, elétrico e tecnológico**.
- Cada modo pode ter um "espaço" próprio dentro desse mundo: um campo aberto de partículas (Observar), uma câmara com o qubit no centro (Brincar) e um laboratório-bancada (Construir).

### 2. Sentir — o que, e para quê
- O usuário **deve se sentir elétrico**: energia, pulsos, brilho e movimento constante.
- **Para quê:** a sensação de estar cercado por algo vivo e instável traduz a natureza probabilística da física quântica. O usuário deve sentir **curiosidade e controle**: o mundo é estranho, mas responde às suas ações.
- Recursos de sensação: partículas e linhas de energia, luz neon azul e roxa, som ambiente de zumbido elétrico, e vibração no controle ao medir ou colapsar um estado.

### 3. Teste da tela — por que não numa tela
- Se fosse 2D, faria mais sentido criar diagramas, desenhos matemáticos e simuladores para interagir. Esses recursos acabam orientados principalmente para **realizar cálculos**, e não para o **aprendizado imersivo geral**.
- Em VR, conceitos tridimensionais como a esfera de Bloch e as rotações viram objetos que o usuário pega e gira, e a escala atômica vira um lugar onde ele está. A **intuição espacial** é o ganho que a tela não oferece.

### 4. Moldura — o que fica dentro, e se ela se mostra
- **Dentro da moldura:** o mundo atômico, os qubits, as portas quânticas e os fenômenos. Tudo que é conceito quântico vive dentro da cena.
- **Fora ou na borda:** menus de troca de modo, explicações em texto e a equação do estado. Ficam em painéis flutuantes que o usuário chama quando quer, e não poluem o ambiente.
- **Ela se mostra?** Parcialmente. O mundo é contínuo e sem bordas visíveis (alta imersão), mas os painéis de informação deixam claro que é um **laboratório de aprendizado**, não uma simulação "real" do átomo. Isso é intencional, ver o item 6.

### 5. Corpo — onde fica e o que pode fazer
- **Onde fica:** o usuário é um observador em escala atômica, do tamanho de um átomo, flutuando no ambiente.
- **O que pode fazer:**
  - **Olhar** ao redor (360°) para observar os fenômenos
  - **Pegar e rotacionar** qubits com os controles ou as mãos
  - **Apontar e selecionar** para medir, trocar de modo e abrir painéis
  - **Arrastar e encaixar** portas nos circuitos
  - **Se mover** por teletransporte entre pontos, para evitar enjoo
- **Conforto:** a experiência pode ser feita sentado ou em pé parado, com movimentos de câmera sempre controlados pelo usuário.

### 6. Risco — como serviria para enganar
- **Falsa literalidade:** qubits não são bolinhas brilhantes e o emaranhamento não é um "feixe de energia". A visualização é uma **metáfora**, e o usuário pode sair achando que é literalmente assim.
  - *Mitigação:* avisos curtos do tipo "isto é uma representação", e diferenciar visualmente o que é metáfora do que é dado (probabilidades e equações).
- **Comunicação mais rápida que a luz:** a animação do emaranhamento pode sugerir que uma informação "viaja" de um qubit ao outro, o que é falso.
  - *Mitigação:* mostrar que o resultado é correlacionado, mas aleatório, e que não dá para transmitir mensagem com isso.
- **Superposição como "estar nos dois ao mesmo tempo":** a simplificação popular é enganosa.
  - *Mitigação:* mostrar amplitudes e probabilidades junto da animação.
- **Encantamento sem aprendizado:** o visual "elétrico" pode impressionar sem ensinar.
  - *Mitigação:* cada fenômeno termina com uma pergunta ou um desafio rápido.

## Dados coletados do usuário (longo prazo)

Mapeamento do que o headset capta do corpo do usuário e de como o jogo usa (ou pode usar) esses dados. A base é o **Meta Quest 3** via navegador (WebXR).

### Coletado hoje

| Sinal | O que é captado | Como o jogo usa |
|---|---|---|
| **Interação do headset (cabeça)** | Posição e rotação da cabeça em 6 graus de liberdade: para onde o usuário olha, em diferentes direções, e onde está no espaço | Câmera da cena: olhar em volta (360°), andar fisicamente pela sala, deixar o painel sempre virado para o usuário |
| **Interação com as mãos** | Posição das 25 articulações de cada mão (hand tracking) e o gesto de pinça (polegar + indicador) | Apontar e "clicar" (pinçar) para teleportar, pinçar o qubit para pegar e girar |
| **Controles** (opcional) | Posição e rotação dos controles, gatilho e analógico | Laser para apontar, gatilho para clicar e girar o qubit, analógico para andar |

### Derivável dos sinais acima (sem sensor extra)

- **Altura do usuário:** altura da cabeça em relação ao chão, para ajustar o pilar e o qubit à altura de cada pessoa.
- **Alcance do braço:** maior distância entre a mão e a cabeça, para posicionar objetos ao alcance.
- **Mão dominante:** qual mão pinça e aponta mais.
- **Atenção:** para onde a cabeça aponta e por quanto tempo (o Quest 3 não tem rastreamento ocular, então a direção da cabeça é usada como aproximação do olhar).
- **Conforto e enjoo:** movimentos bruscos de cabeça, pausas longas ou saída antecipada podem indicar desconforto.

### Possível no futuro

- **Métricas de aprendizado:** tempo para encontrar cada estado no desafio, número de tentativas, quais estados geram mais erros.
- **Mapa de calor do olhar:** quais partes da esfera de Bloch e do painel recebem mais atenção.
- **Rastreamento ocular e facial:** só em headsets que têm esses sensores (por exemplo, o Meta Quest Pro), não no Quest 3.
- **Ambiente real (realidade mista):** detecção de paredes, mesas e profundidade para posicionar o qubit no espaço do usuário.

### Privacidade

- Hoje os dados são usados **só em tempo real**, dentro do navegador: nada é gravado nem enviado para servidor.
- Dados de movimento do corpo podem identificar uma pessoa (o jeito de andar e de mexer a cabeça é quase único). Se no futuro houver coleta de métricas:
  - pedir **consentimento** explícito antes de coletar;
  - guardar apenas dados **agregados ou anonimizados** (por exemplo, "tempo para encontrar |+⟩", não a trajetória completa da cabeça);
  - seguir a **LGPD**, informando o que é coletado, para quê e por quanto tempo.

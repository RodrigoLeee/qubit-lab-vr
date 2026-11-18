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

# Plano de Testes — Qubit Lab VR

Testes com usuários para orientar decisões de design da experiência imersiva. Cada teste compara alternativas, define o que é medido e registra os resultados.

## Estrutura de cada teste

- **Pergunta:** a decisão de design que o teste deve responder.
- **Hipótese:** o resultado esperado e o motivo.
- **Variantes:** as alternativas comparadas.
- **Tarefa:** o que o participante faz.
- **Métricas:** o que é medido, de forma objetiva e subjetiva.
- **Procedimento:** como o teste é conduzido.
- **Resultados e decisão:** preenchidos após a execução.

## Teste 1 — HUD na mão × informação no mapa

### Pergunta

Onde a informação do estado do qubit (θ, φ, amplitudes e probabilidades) deve ficar para apoiar o aprendizado sem atrapalhar a imersão: presa à mão do usuário, como um item que ele segura, ou fixa no mapa, ao lado do qubit?

### Hipótese

A informação **na mão** reduz o tempo de consulta, porque acompanha o olhar e o gesto, mas compete com a mão que gira o qubit. A informação **no mapa** é mais estável e legível, mas exige virar a cabeça e se deslocar. Espera-se que a variante na mão seja mais rápida e que a variante no mapa seja mais confortável.

### Variantes

| | A — Informação no mapa | B — HUD na mão |
|---|---|---|
| Onde fica | Painel fixo ao lado do qubit, sempre virado para o jogador | Painel preso ao controle da mão livre, como um item que o usuário segura |
| Como consultar | Olhar para o painel | Levantar o controle e olhar para ele |
| Estado atual | Implementada no modo Qubit | Em desenvolvimento |

### Tarefa

No modo Qubit, completar **5 desafios** de "encontre o estado" (estados da base sorteados), usando o controle para girar o qubit.

### Métricas

**Objetivas**
- Tempo para completar cada desafio.
- Número de vezes que o participante consulta a informação (olhar para o painel ou levantar a mão).
- Deslocamentos pela plataforma durante a tarefa.

**Subjetivas** (escala de 1 a 5, ao fim de cada variante)
- Facilidade de ler a informação.
- Sensação de imersão.
- Conforto físico (braço, pescoço, enjoo).
- Preferência entre as variantes, com comentário livre.

### Procedimento

1. Participantes: estudantes que cursam ou cursaram computação quântica.
2. Ambientação de 2 minutos no menu e no modo Qubit, sem cronometrar.
3. Cada participante executa as duas variantes. Metade começa pela A e metade pela B, para equilibrar o efeito de aprendizado.
4. Questionário após cada variante e entrevista curta ao final.
5. Equipamento: Meta Quest 3 pelo navegador, com os controles.

### Resultados e decisão

| Participante | Ordem | Tempo médio A | Tempo médio B | Consultas A | Consultas B | Preferência |
|---|---|---|---|---|---|---|
| | | | | | | |

**Decisão:** registrada após a análise dos resultados.

## Teste 2 — Entradas de mirar e confirmar

### Pergunta

Qual entrada é mais precisa, confortável e divertida para mirar e confirmar: olhar com tempo, aceno de cabeça (a interação sem mãos do projeto), controle ou barra de espaço no PC?

### Hipótese

O **controle** é o mais preciso, por ser familiar, mas usa as mãos. Entre as entradas sem mãos, o **aceno de cabeça** é mais rápido que o **olhar com tempo**, porque não depende de esperar 1,5 s, mas pode ser menos preciso, já que a cabeça se move durante o gesto.

### Variantes

| Entrada | Mirar | Confirmar |
|---|---|---|
| Olhar com tempo | Cabeça | Olhar 1,5 s |
| Aceno de cabeça | Cabeça | Baixar e voltar a cabeça |
| Controle | Raio do controle | Gatilho |
| Mãos (hand tracking) | Raio estimado do ombro pela mão | Pinça |
| PC | Direção da câmera | Barra de espaço |

### Tarefa

Na página [`jogo/testes.html`](../jogo/testes.html):

1. **Botões:** na demonstração de emaranhamento, acionar *Medir*, *O que está acontecendo?* e *Reiniciar*.
2. **Desafio da bolinha:** fazer 5 lançamentos no alvo com cada entrada.
3. **Lousa:** ligar a caneta, desenhar um círculo com a cabeça e desligar a caneta.

### Métricas

**Objetivas** (exibidas na própria cena, sem gravar dados pessoais)
- Tempo entre começar a mirar e confirmar, por entrada (placa de registro).
- Acertos por lançamento, por entrada (placar do desafio).
- Acionamentos sem querer, anotados pelo observador.

**Subjetivas** (escala de 1 a 5, ao fim de cada entrada)
- Precisão percebida.
- Conforto (pescoço, olhos, enjoo).
- Diversão.
- Preferência entre as entradas, com comentário livre.

### Procedimento

1. Ambientação de 2 minutos na página de testes.
2. Cada participante usa todas as entradas disponíveis no dispositivo, em ordem alternada entre os participantes.
3. Questionário após cada entrada e entrevista curta ao final.

### Resultados e decisão

**Rodada 1 — 26/11/2026, Meta Quest 3, 1 participante (o autor).** Entradas usadas no jogo e na página de testes: controle, mãos (pinça) e olhar com tempo.

| Entrada | Observação | Avaliação |
|---|---|---|
| **Controle** (laser + gatilho) | Mira estável e confirmação clara; funcionou bem nos botões do menu, nas estações do modo Quântico, no teleporte e ao girar o qubit | Melhor desempenho |
| **Mãos** (pinça) | Difícil de controlar: ao tentar acionar os botões do menu e do modo Quântico, a mesma pinça disparava o teleporte | Acionamentos sem querer; descartada |
| **Olhar com tempo** (1,5 s) | Funciona sem acessório, mas a espera de 1,5 s por confirmação torna a interação lenta | Lenta para uso contínuo |

**Leitura dos resultados**
- A pinça acumulava duas funções (clicar e teleportar) no mesmo gesto, e o sistema não conseguia distinguir a intenção: o problema é de **mirar e confirmar**, não de precisão da mão.
- O olhar com tempo confirma pela permanência, e não por um gesto: é confiável, mas o tempo do fuse pesa a cada ação.
- O controle separa as funções em botões diferentes e é um gesto já incorporado ao hábito motor do jogador (gatilho), por isso some da atenção e deixa o foco nos fenômenos.

**Limitação:** uma rodada com um único participante. Os resultados orientam a decisão de design e devem ser confirmados em novas rodadas com outros participantes.

**Decisão:** o **controle passa a ser a interação principal** do Qubit Lab VR. A interação por **mãos (pinça) foi removida** do jogo. O olhar com tempo e o aceno de cabeça continuam disponíveis na página de testes como alternativa sem mãos.

## Próximos testes

| Teste | Pergunta |
|---|---|
| 3 — Texto × representação visual | A explicação dos fenômenos deve ser em texto no painel ou apenas visual na cena? |
| 4 — Formas geométricas × assets | Peças modeladas (assets) tornam as portas do modo Circuit mais fáceis de reconhecer e encaixar do que formas simples? |
| 5 — Teleporte × deslocamento contínuo | Qual forma de deslocamento é mais confortável na plataforma? |

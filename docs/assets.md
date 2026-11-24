# Assets — Qubit Lab VR

Diretrizes para criar, organizar e usar assets (modelos 3D, texturas e sons) no jogo, e critérios para decidir entre formas geométricas e assets.

## 1. Formas geométricas × assets

O jogo usa duas fontes de objetos 3D:

- **Formas geométricas:** primitivas do A-Frame e do three.js (esferas, cilindros, planos, linhas) criadas em código.
- **Assets:** modelos feitos no Blender e exportados para o jogo, além de texturas e sons.

### Quando usar formas geométricas

- **O objeto representa um dado:** a esfera de Bloch, o vetor de estado, os arcos de θ e φ e as barras de probabilidade mudam com a matemática a cada quadro. Gerá-los em código mantém a representação fiel ao estado do qubit.
- **O objeto é abstrato por natureza:** conceitos quânticos não têm aparência real, e formas simples evitam sugerir uma literalidade que não existe (ver o eixo Risco da [ficha técnica](ficha_tecnica.md)).
- **A estética é neon e minimalista:** grades, bordas, anéis e linhas de luz são formas simples com material emissivo.
- **Desempenho:** primitivas são leves e não exigem download.

### Quando usar assets

- **O objeto é físico e reconhecível:** a bancada do modo Circuit, as portas quânticas como peças encaixáveis, o pedestal ou elementos de cenário.
- **O objeto precisa ser manipulado com as mãos:** peças com forma, pegada e encaixe claros comunicam melhor a interação do que uma caixa genérica.
- **A forma é complexa demais para código:** modelos orgânicos, chanfros, detalhes e peças compostas.
- **Ambientação:** elementos que dão identidade a cada mapa sem carregar informação matemática.

### Regra de decisão

| Pergunta | Se sim |
|---|---|
| O objeto muda conforme a matemática do estado? | Forma geométrica em código |
| O objeto representa um conceito sem aparência real? | Forma geométrica em código |
| O usuário pega, encaixa ou reconhece o objeto pela forma? | Asset |
| A forma exige detalhe que o código não entrega bem? | Asset |
| É só cenário ou ambientação? | Asset, se o ganho visual compensar o peso |

## 2. Do Blender para o VR

1. **Escala:** modelar em metros (1 unidade do Blender = 1 m), com o jogador como referência de 1,6 m de altura dos olhos. Aplicar a escala antes de exportar (*Apply → All Transforms*).
2. **Origem:** posicionar a origem do objeto no ponto de apoio (por exemplo, a base do pedestal), para facilitar o posicionamento na cena.
3. **Exportação:** formato **glTF 2.0 binário (`.glb`)**, com a opção *+Y Up* (o Blender usa Z para cima; o A-Frame usa Y).
4. **Materiais:** usar *Principled BSDF*; cores emissivas no canal *Emission* para manter a estética neon.
5. **Desempenho no Meta Quest 3:**
   - poucos polígonos por modelo e poucas malhas separadas (cada malha é uma chamada de desenho);
   - texturas em potência de dois, até 2048 × 2048, preferindo 1024;
   - compressão Draco ou meshopt na exportação quando o modelo for grande.
6. **Uso no A-Frame:** declarar o arquivo em `<a-assets>` e aplicar com o componente `gltf-model`:

```html
<a-assets>
  <a-asset-item id="bancada" src="assets/modelos/bancada.glb"></a-asset-item>
</a-assets>

<a-entity gltf-model="#bancada" position="0 0 -2"></a-entity>
```

## 3. Estrutura de pastas

```
assets-fonte/              arquivos de trabalho (não carregados pelo jogo)
  blender/                 .blend de cada modelo
jogo/
  assets/
    modelos/               .glb exportados do Blender
    texturas/              .png / .jpg / .ktx2
    sons/                  .ogg / .mp3
```

- **`assets-fonte/`** guarda os arquivos editáveis; **`jogo/assets/`** guarda apenas o que o jogo carrega.
- **Nomes:** minúsculas, sem acentos, com hífen, descrevendo o objeto (`porta-hadamard.glb`, `bancada-circuit.glb`).
- **Licenças:** usar apenas assets próprios ou com licença que permita uso (por exemplo, CC0), registrando a origem de cada asset de terceiros.

## 4. Aplicação por modo

| Modo | Formas geométricas | Assets |
|---|---|---|
| Menu | Plataforma, grade, botões neon | Ambientação opcional |
| Qubit | Esfera de Bloch, vetor, ciclo trigonométrico, painel | Pedestal |
| Quântico | Representações dos fenômenos (superposição, emaranhamento, interferência) | Ambientação do mapa |
| Circuit | Fios de luz e estado atravessando o circuito | Bancada e portas quânticas como peças encaixáveis |

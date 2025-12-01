# Estrutura CSS - Ficha de Ordem Paranormal

## 📁 Organização Modular

O CSS foi reorganizado em uma estrutura modular e profissional, onde cada arquivo é responsável por um componente específico da aplicação.

### Arquivos CSS

#### `global.css`
- **Responsabilidade**: Reset, variáveis CSS, estilos globais
- **Conteúdo**:
  - `:root` com variáveis de cores e tipografia
  - Reset universal (`* {}`)
  - Estilos base para `body`, `h1`, `h2`, `label`
  - Layout principal (`.layout`, `.names`)
  - Responsividade geral para todos os breakpoints

---

#### `components/nomes.css`
- **Responsabilidade**: Nomes do personagem e do jogador
- **Classes principais**:
  - `.names-ritual` - Container dos nomes
  - `.name-block` - Bloco individual de nome
  - `.name-block label` - Label do campo
  - `.name-block input` - Input do nome
- **Responsividade**: Adaptável para 1200px, 900px e 768px

---

#### `components/pericias.css`
- **Responsabilidade**: Lista de perícias
- **Classes principais**:
  - `.pericias-list` - Container da lista
  - `.per-row` - Linha individual de perícia
  - `.per-row span` - Nome da perícia
  - `.per-row input` - Valor da perícia
- **Melhorias**: Transições suaves, focus states, efeitos de shadow

---

#### `components/atributos.css`
- **Responsabilidade**: Atributos e roda de atributos
- **Classes principais**:
  - `.attr-inputs` - Grid dos 5 atributos
  - `.attr-wheel-box` - Container da roda
  - `.attr-wheel-box::before` - Fundo decorativo
  - SVG styles - Estilos do radar/roda
- **Responsividade**: Adaptações específicas para SVG em diferentes tamanhos

---

#### `components/informacoes.css`
- **Responsabilidade**: Informações do personagem
- **Classes principais**:
  - `.right-column` - Coluna direita principal
  - `.card-attributes` - Card de atributos
  - `.card-infos` - Card de informações
  - `.info-fields` - Origem/Classe/Trilha
  - `.char-meta` - NEX/Nível/Limite PD
  - `.game-info` - PV/PE/DEF
  - `.extra-info` - Resistências/Proteção
- **Responsividade**: Breakpoints em 1024px, 900px e 768px

---

#### `components/ataques.css`
- **Responsabilidade**: Seção de ataques
- **Classes principais**:
  - `.card-attacks` - Card principal
  - `.ataques-list` - Lista de ataques
  - `.ataque-row` - Linha individual de ataque
- **Grid responsivo**: 4 colunas → 2 colunas → 1 coluna

---

#### `components/habilidades.css`
- **Responsabilidade**: Habilidades e rituais
- **Classes principais**:
  - `.card-habilidades` - Card principal
  - `.hab-row` - Linha de habilidade (7 colunas)
  - `.elemento-box` - Ícone do elemento
  - `.btn-remove` - Botão remover habilidade
- **Grid responsivo**: Reduz colunas progressivamente (7 → 5 → 2 → 1)

---

#### `components/itens.css`
- **Responsabilidade**: Itens, categorias e carga
- **Classes principais**:
  - `.card-itens` - Card principal
  - `.itens-top` - Grid categorias/carga
  - `.categorias-grid` - Grid das 4 categorias
  - `.carga-card` - Card de carga
  - `.itens-list` - Lista de itens
  - `.item-row` - Linha de item
- **Responsividade**: Categorias adaptáveis (4 → 3 → 2)

---

#### `components/regras.css`
- **Responsabilidade**: Regras do sistema (Combate, Investigação, etc)
- **Classes principais**:
  - `.card-regras` - Card principal
  - `.regra-box` - Caixa individual de regra
  - `.regra-header` - Header clicável
  - `.regra-conteudo` - Conteúdo expandível
  - `.subcard` - Subcards dentro de regras
  - `.sublista` - Listas estilizadas
  - `.narrativa-box` - Box de narrativa especial
- **Interatividade**: Toggle com rotate animation

---

#### `components/controles.css`
- **Responsabilidade**: Controles finais (botões e status)
- **Classes principais**:
  - `.bottom-controls` - Container dos controles
  - `.btn-add` - Botão adicionar (global)
  - `#save-status` - Status de salvamento
- **Melhorias**: Hover states com shadow, botão full-width em mobile

---

## 🎨 Temas de Responsividade

A aplicação suporta **4 breakpoints principais**:

### Desktop (1200px+)
- Layout completo com toda a informação
- Grids com máximo de colunas
- Elementos com espaçamento generoso

### Laptop (1024px - 1199px)
- Pequenas ajustes nos grids
- Reduce gap e padding moderadamente

### Tablet (768px - 1023px)
- Layout começa a se adaptar
- Grids reduzem para 2-3 colunas
- Inputs recebem font-size maior para usabilidade

### Mobile (< 768px)
- Layout 100% vertical
- Grids em 1 coluna (exceto categorias)
- Botões full-width para facilitar toque
- Padding e margin reduzidos
- Font-sizes aumentadas para legibilidade

---

## 🎯 Convenções CSS

### Nomenclatura
- Classes específicas de componente: `.card-nomecomponente`
- Elementos dentro: `.card-nomecomponente__elemento` ou `.elemento-específico`
- Estados: `.active`, `.focus`, `:hover`, `:focus`

### Estrutura
```css
/* Comentário de seção */
.classe {
  /* Propriedades de layout */
  /* Propriedades de estilo */
  /* Propriedades de animação */
}

/* Responsividade ordenada por ordem decrescente */
@media (max-width: 1200px) { }
@media (max-width: 1024px) { }
@media (max-width: 900px) { }
@media (max-width: 768px) { }
```

---

## 🔄 Como Adicionar um Novo Componente

1. Crie um novo arquivo em `components/novo-componente.css`
2. Adicione o import no `index.html` após `global.css`
3. Siga a estrutura:
   ```css
   /* Comentário do componente */
   .novo-componente { }
   .novo-componente__elemento { }
   
   /* Responsividade */
   @media (max-width: 1200px) { }
   @media (max-width: 900px) { }
   @media (max-width: 768px) { }
   ```

---

## ✅ Melhorias Implementadas

- ✨ **Modularização**: Cada componente em seu próprio arquivo
- 🎯 **Manutenibilidade**: Fácil encontrar e editar CSS específico
- 📱 **Responsividade**: 4 breakpoints bem definidos
- 🚀 **Performance**: Possibilidade de lazy-load de componentes
- 🎨 **Consistência**: Variáveis centralizadas e reutilização de estilos
- 💫 **UX**: Focus states, transitions e hover effects
- 🔍 **Documentação**: Este arquivo README como guia

---

## 📝 Notas Importantes

- Arquivos antigos (`reset.css`, `base.css`, `layout.css`, `theme.css`, `ficha.css`) foram removidos
- Todo o CSS agora está em arquivos modularizados
- O `global.css` é carregado primeiro, seguido pelos componentes
- Mantenha os breakpoints consistentes ao adicionar novos componentes

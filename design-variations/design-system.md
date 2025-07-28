# 🎨 ThatEasy Design System

## Visão Geral

Este design system define os elementos visuais e padrões de interação fundamentais que devem ser mantidos consistentes em todas as variações de layout do ThatEasy. O objetivo é garantir uma experiência coesa e reconhecível, independentemente da abordagem de design escolhida.

---

## 🎯 Princípios de Design

### 1. **Educação em Primeiro Lugar**
- Todo elemento deve servir ao propósito educacional
- Priorizar clareza sobre complexidade visual
- Facilitar o processo de aprendizagem

### 2. **Acessibilidade Universal**
- Contraste mínimo de 4.5:1 para texto normal
- Navegação possível apenas por teclado
- Suporte para leitores de tela

### 3. **Simplicidade Intencional**
- Cada elemento deve ter um propósito claro
- Evitar decorações desnecessárias
- Foco na funcionalidade

### 4. **Consistência Adaptável**
- Elementos comuns devem ser reconhecíveis
- Permitir variações contextuais
- Manter hierarquia visual clara

---

## 🎨 Sistema de Cores

### Paleta Primária

```css
/* Azul ThatEasy - Cor principal da marca */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Cor principal */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

### Paleta de Neutros

```css
/* Cinzas para texto e elementos de suporte */
--neutral-50: #f8fafc;
--neutral-100: #f1f5f9;
--neutral-200: #e2e8f0;
--neutral-300: #cbd5e1;
--neutral-400: #94a3b8;
--neutral-500: #64748b;
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1e293b;
--neutral-900: #0f172a;
```

### Cores Semânticas

```css
/* Success - Verde */
--success-50: #f0fdf4;
--success-500: #10b981;
--success-700: #047857;

/* Warning - Amarelo */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-700: #b45309;

/* Error - Vermelho */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-700: #b91c1c;

/* Info - Azul claro */
--info-50: #f0f9ff;
--info-500: #06b6d4;
--info-700: #0e7490;
```

### Uso das Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Texto Principal** | `--neutral-800` | Títulos e texto importante |
| **Texto Secundário** | `--neutral-600` | Texto de apoio e descrições |
| **Texto Terciário** | `--neutral-400` | Metadados e informações menos importantes |
| **Links** | `--primary-600` | Links e elementos interativos |
| **Botão Primário** | `--primary-500` | Ações principais |
| **Fundo Principal** | `--neutral-50` | Fundo da aplicação |
| **Fundo de Cards** | `#ffffff` | Fundo de elementos elevados |
| **Bordas** | `--neutral-200` | Bordas e divisores |

---

## 🔤 Tipografia

### Hierarquia de Texto

```css
/* Família de Fontes */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

/* Tamanhos e Pesos */
--text-xs: 12px;     /* Legendas, metadados */
--text-sm: 14px;     /* Texto de apoio */
--text-base: 16px;   /* Texto padrão */
--text-lg: 18px;     /* Texto destacado */
--text-xl: 20px;     /* Subtítulos */
--text-2xl: 24px;    /* Títulos de seção */
--text-3xl: 30px;    /* Títulos principais */
--text-4xl: 36px;    /* Títulos de página */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Altura de linha */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Escala Tipográfica

| Elemento | Tamanho | Peso | Cor | Uso |
|----------|---------|------|-----|-----|
| **H1** | `--text-4xl` | `--font-bold` | `--neutral-900` | Títulos de página |
| **H2** | `--text-3xl` | `--font-semibold` | `--neutral-800` | Títulos de seção |
| **H3** | `--text-2xl` | `--font-semibold` | `--neutral-800` | Subtítulos |
| **H4** | `--text-xl` | `--font-medium` | `--neutral-700` | Títulos de cards |
| **Body** | `--text-base` | `--font-normal` | `--neutral-700` | Texto principal |
| **Small** | `--text-sm` | `--font-normal` | `--neutral-600` | Texto secundário |
| **Caption** | `--text-xs` | `--font-medium` | `--neutral-500` | Metadados |

---

## 📏 Espaçamento

### Sistema de Espaços

```css
--space-1: 4px;     /* 0.25rem */
--space-2: 8px;     /* 0.5rem */
--space-3: 12px;    /* 0.75rem */
--space-4: 16px;    /* 1rem */
--space-5: 20px;    /* 1.25rem */
--space-6: 24px;    /* 1.5rem */
--space-8: 32px;    /* 2rem */
--space-10: 40px;   /* 2.5rem */
--space-12: 48px;   /* 3rem */
--space-16: 64px;   /* 4rem */
--space-20: 80px;   /* 5rem */
```

### Guidelines de Uso

- **Margem interna (padding):** Usar escala de 4px (4, 8, 12, 16, 20, 24...)
- **Margem externa (margin):** Seguir mesma escala
- **Gap entre elementos:** Múltiplos de 4px
- **Breakpoints:** 480px (mobile), 768px (tablet), 1024px (desktop), 1280px (large)

---

## 🔘 Componentes Base

### Botões

```css
/* Botão Primário */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

/* Botão Secundário */
.btn-secondary {
  background: white;
  color: var(--neutral-700);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--neutral-50);
  border-color: var(--neutral-400);
}
```

### Cards

```css
.card {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## 🏷️ Tags e Badges

### Tags de Conteúdo

```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: 6px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
```

### Status Badges

| Status | Cor de Fundo | Cor do Texto | Uso |
|--------|-------------|-------------|-----|
| **Novo** | `--primary-50` | `--primary-700` | Conteúdo recente |
| **Trending** | `--warning-50` | `--warning-700` | Conteúdo em alta |
| **Concluído** | `--success-50` | `--success-700` | Metas/tarefas finalizadas |
| **Pendente** | `--neutral-100` | `--neutral-600` | Itens aguardando ação |

---

## 📱 Padrões de Layout

### Grid System

```css
/* Container principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Grid responsivo */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Mobile first */
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

### Layout Patterns

#### Header Padrão
- Altura: 60px (mobile) / 70px (desktop)
- Background: branco
- Border bottom: 1px solid `--neutral-200`
- Posição: fixa no topo

#### Sidebar
- Largura: 250px (desktop) / 200px (tablet)
- Background: branco
- Border right: 1px solid `--neutral-200`
- Posição: fixa (desktop) / overlay (mobile)

#### Main Content
- Max-width: 800px
- Padding: `--space-6`
- Margin: auto

---

## 🎭 Estados de Interação

### Estados dos Componentes

```css
/* Estado Normal */
.interactive {
  transition: all 0.2s ease;
}

/* Estado Hover */
.interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estado Active/Pressed */
.interactive:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estado Focus */
.interactive:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Estado Disabled */
.interactive:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## 🌟 Ícones e Emojis

### Sistema de Ícones

Para manter consistência entre diferentes layouts, usar preferencialmente:

1. **Emojis Unicode** para simplicidade e universalidade
2. **Lucide Icons** para ícones mais específicos
3. **Tabler Icons** como alternativa

### Ícones Padrão

| Função | Emoji | Alternativo | Contexto |
|---------|-------|-------------|----------|
| **Início** | 🏠 | `home` | Navegação principal |
| **Busca** | 🔍 | `search` | Busca e exploração |
| **IA** | 🤖 | `brain` | Assistente inteligente |
| **Estudos** | 📚 | `book` | Conteúdo educacional |
| **Grupos** | 👥 | `users` | Comunidade |
| **Configurações** | ⚙️ | `settings` | Configurações |
| **Notificações** | 🔔 | `bell` | Alertas e avisos |
| **Curtir** | ❤️ | `heart` | Reação positiva |
| **Comentar** | 💬 | `message` | Interação |
| **Compartilhar** | 📤 | `share` | Compartilhamento |

---

## 📊 Visualização de Dados

### Cores para Gráficos

```css
--chart-1: #3b82f6;  /* Azul primário */
--chart-2: #10b981;  /* Verde */
--chart-3: #f59e0b;  /* Amarelo */
--chart-4: #ef4444;  /* Vermelho */
--chart-5: #8b5cf6;  /* Roxo */
--chart-6: #06b6d4;  /* Cyan */
--chart-7: #f97316;  /* Laranja */
--chart-8: #84cc16;  /* Lima */
```

### Estilos de Gráficos

- **Barras:** Cantos arredondados (4px)
- **Linhas:** Espessura 2-3px
- **Pontos:** Raio 4-6px
- **Área:** Transparência 20-30%

---

## 🎮 Gamificação

### Elementos de Progresso

```css
/* Barra de progresso */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--neutral-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  border-radius: 4px;
  transition: width 0.5s ease;
}
```

### Sistema de XP e Níveis

- **XP Base por ação:** 10-100 pontos
- **Multiplicadores:** 1.5x (streak), 2x (primeiro)
- **Cores de nível:** 
  - Iniciante: Azul (`--primary-500`)
  - Intermediário: Verde (`--success-500`)
  - Avançado: Dourado (`--warning-500`)
  - Expert: Roxo (`#8b5cf6`)

---

## 🔄 Animações e Transições

### Durações Padrão

```css
--duration-fast: 0.15s;     /* Hover, click */
--duration-normal: 0.2s;    /* Transições gerais */
--duration-slow: 0.3s;      /* Modais, overlays */
--duration-extra-slow: 0.5s; /* Progressos, loading */
```

### Easing Functions

```css
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile first approach */
@media (min-width: 480px) { /* Large mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

### Padrões Responsivos

1. **Mobile:** Layout de coluna única, navegação bottom
2. **Tablet:** Layout híbrido, alguns elementos lado a lado
3. **Desktop:** Layout multi-coluna, sidebar fixa

---

## ♿ Acessibilidade

### Checklist Obrigatório

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande (18px+)
- [ ] Navegação completa por teclado
- [ ] Estados de foco visíveis
- [ ] Labels para elementos de formulário
- [ ] Alt text para imagens informativas
- [ ] Estrutura semântica (headings, landmarks)
- [ ] Suporte para leitores de tela

### ARIA Labels Padrão

```html
<!-- Navegação -->
<nav aria-label="Navegação principal">
<nav aria-label="Navegação secundária">

<!-- Botões -->
<button aria-label="Abrir menu">
<button aria-label="Curtir post">

<!-- Estados dinâmicos -->
<div aria-live="polite"> <!-- Para atualizações suaves -->
<div aria-live="assertive"> <!-- Para alertas importantes -->
```

---

## 🔧 Implementação

### CSS Custom Properties

```css
:root {
  /* Aplicar todas as variáveis definidas acima */
  /* Permite fácil tematização e manutenção */
}

/* Tema escuro (futuro) */
[data-theme="dark"] {
  --neutral-50: #0f172a;
  --neutral-900: #f8fafc;
  /* Inverter escala de cinzas */
}
```

### Classes Utilitárias

```css
/* Espaçamento */
.p-1 { padding: var(--space-1); }
.m-4 { margin: var(--space-4); }
.gap-6 { gap: var(--space-6); }

/* Tipografia */
.text-sm { font-size: var(--text-sm); }
.font-semibold { font-weight: var(--font-semibold); }

/* Cores */
.text-primary { color: var(--primary-500); }
.bg-neutral-50 { background: var(--neutral-50); }

/* Layout */
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Responsividade */
.md\:block { @media (min-width: 768px) { display: block; } }
.lg\:grid-3 { @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); } }
```

---

## 📋 Checklist de Implementação

### Para cada nova variação de layout:

- [ ] Usar paleta de cores definida
- [ ] Seguir hierarquia tipográfica
- [ ] Implementar espaçamento consistente
- [ ] Aplicar padrões de componentes
- [ ] Incluir estados de interação
- [ ] Garantir responsividade
- [ ] Verificar acessibilidade
- [ ] Testar em diferentes dispositivos
- [ ] Validar com usuários
- [ ] Documentar desvios do design system

---

*Este design system é um documento vivo que deve evoluir com base no feedback dos usuários e nas necessidades do produto. Toda alteração deve ser documentada e comunicada à equipe.* 
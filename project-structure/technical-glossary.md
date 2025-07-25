# Glossário Técnico - ThatEasy

Este arquivo contém explicações simples e didáticas de todos os termos técnicos utilizados na documentação do projeto ThatEasy, organizados por categoria para facilitar a consulta.

## 📚 Índice por Categoria

- [🏗️ Arquitetura e Estrutura](#️-arquitetura-e-estrutura)
- [💻 Frontend e Interface](#-frontend-e-interface)
- [🔧 Backend e Servidor](#-backend-e-servidor)
- [📊 Banco de Dados](#-banco-de-dados)
- [🤖 Inteligência Artificial](#-inteligência-artificial)
- [📱 Mobile](#-mobile)
- [🛠️ DevOps e Infraestrutura](#️-devops-e-infraestrutura)
- [🔐 Segurança](#-segurança)
- [🌐 Web e Redes](#-web-e-redes)
- [🧪 Testes e Qualidade](#-testes-e-qualidade)

---

## 🏗️ Arquitetura e Estrutura

### **Monorepo**
Um **repositório único** que contém múltiplas aplicações e packages relacionados. Em vez de ter repositórios separados para frontend, backend e mobile, tudo fica em um só lugar.
- **Vantagem**: Facilita compartilhamento de código e coordenação entre equipes
- **Exemplo**: Google, Meta, Microsoft usam monorepos para seus produtos

### **Microservices vs Monolith**
- **Monolith**: Aplicação única e grande (como um prédio inteiro)
- **Microservices**: Várias aplicações pequenas que conversam entre si (como apartamentos separados)
- **ThatEasy**: Usamos uma abordagem híbrida - monorepo com serviços modulares

### **API (Application Programming Interface)**
Uma "ponte" que permite diferentes aplicações conversarem entre si. É como um garçom que leva seu pedido para a cozinha e traz a comida de volta.
- **Exemplo**: App mobile pede dados do usuário → API busca no banco → retorna para o app

### **REST API**
Um tipo específico de API que usa métodos HTTP padrão:
- **GET**: Buscar dados (como "mostrar meu perfil")
- **POST**: Criar algo novo (como "criar post")
- **PUT**: Atualizar (como "editar perfil")
- **DELETE**: Apagar (como "deletar comentário")

### **GraphQL**
Uma alternativa ao REST que permite pedir exatamente os dados que você precisa, nem mais nem menos.
- **Vantagem**: Reduz tráfego de rede
- **Usado por**: Facebook, GitHub, Shopify

---

## 💻 Frontend e Interface

### **Framework**
Um "esqueleto" ou conjunto de ferramentas que facilita o desenvolvimento. É como uma casa pré-construída onde você só precisa decorar.
- **React**: Framework para criar interfaces
- **Next.js**: Framework baseado em React com funcionalidades extras

### **SSR (Server-Side Rendering)**
O servidor "monta" a página completa antes de enviar para o navegador. É mais rápido para o usuário ver o conteúdo.
- **Contrário**: SPA (Single Page Application) - monta no navegador

### **SSG (Static Site Generation)**
Páginas são geradas antecipadamente e servidas como arquivos estáticos. Muito rápido!
- **Usado para**: Blogs, documentação, landing pages

### **TypeScript**
JavaScript com "tipos" - como dizer "esta variável só pode ser um número". Previne muitos bugs.
```typescript
// JavaScript normal
let idade = "25"; // Ops, deveria ser número!

// TypeScript
let idade: number = 25; // ✅ Correto
```

### **Component**
Pedaços reutilizáveis de interface. Como LEGOs que você pode usar em diferentes lugares.
```jsx
// Componente Button que pode ser usado em qualquer lugar
<Button color="blue">Clique aqui</Button>
```

### **State Management**
Como a aplicação "lembra" de informações (estado atual). 
- **Exemplo**: Usuário logado, carrinho de compras, tema dark/light
- **Zustand**: Ferramenta simples para gerenciar estado

---

## 🔧 Backend e Servidor

### **Node.js**
Permite usar JavaScript no servidor (não só no navegador). É como ter o mesmo idioma para frontend e backend.

### **Fastify**
Um framework para Node.js focado em velocidade. Como Express.js, mas mais rápido.
- **Benchmark**: ~65,000 requests/segundo vs Express ~35,000

### **ORM (Object-Relational Mapping)**
Traduz entre banco de dados e código. Em vez de escrever SQL, você usa JavaScript.
```javascript
// Sem ORM (SQL puro)
"SELECT * FROM users WHERE age > 18"

// Com ORM (Prisma)
User.findMany({ where: { age: { gt: 18 } } })
```

### **Prisma**
O ORM que usamos. Gera tipos TypeScript automaticamente baseado no schema do banco.

### **Middleware**
Código que executa "no meio" do caminho entre request e response. Como seguranças que checam você antes de entrar.
- **Exemplos**: Autenticação, logs, rate limiting

### **WebSocket**
Conexão contínua entre navegador e servidor. Permite tempo real.
- **HTTP normal**: Cliente pergunta → Servidor responde → Fim
- **WebSocket**: Conexão aberta, ambos podem falar a qualquer momento

---

## 📊 Banco de Dados

### **PostgreSQL**
Banco de dados relacional (tabelas com relacionamentos). Robusto e confiável.
- **Alternativas**: MySQL, SQLite
- **NoSQL**: MongoDB, Firebase

### **Redis**
Banco super rápido que guarda dados na memória RAM. Usado para cache e sessões.
- **Velocidade**: Milissegundos vs segundos do PostgreSQL

### **Cache**
Guardar dados temporariamente em lugar rápido para não buscar sempre no banco principal.
- **Analogia**: Geladeira (cache) vs mercado (banco de dados)

### **Migration**
Mudanças estruturais no banco de dados versionadas e aplicáveis.
```sql
-- Migration: adicionar coluna 'bio' na tabela users
ALTER TABLE users ADD COLUMN bio TEXT;
```

### **Seed**
Popular o banco com dados iniciais para desenvolvimento/teste.

### **Index**
"Índice" do banco que acelera buscas. Como índice de um livro.
- **Sem índice**: Lê página por página
- **Com índice**: Vai direto na página certa

---

## 🤖 Inteligência Artificial

### **LLM (Large Language Model)**
IA treinada com muito texto para entender e gerar linguagem natural.
- **Exemplos**: GPT-4, Claude, Gemini

### **Vector Database**
Banco que armazena "representações matemáticas" de textos para busca semântica.
- **Pinecone**: O que usamos
- **Busca normal**: Procura palavras exatas
- **Busca semântica**: Entende significado

### **Embedding**
Transformar texto em números (vetores) que IA consegue processar.
```
"Cachorro" → [0.2, 0.8, 0.1, ...]
"Cão" → [0.3, 0.9, 0.1, ...] // Similar ao cachorro
```

### **Fine-tuning**
Treinar IA com dados específicos para melhorar performance em tarefa específica.

### **Prompt Engineering**
Arte de escrever instruções para IA obter melhores resultados.

---

## 📱 Mobile

### **React Native**
Framework para criar apps mobile usando React (mesmo código para iOS e Android).

### **Expo**
Plataforma que facilita desenvolvimento React Native. Como WordPress para mobile.

### **Cross-platform**
Um código funciona em múltiplas plataformas.
- **React Native**: iOS + Android
- **Flutter**: iOS + Android + Web

### **Native**
Código específico para cada plataforma (Swift para iOS, Kotlin para Android).
- **Vantagem**: Máxima performance
- **Desvantagem**: Duas equipes, duas codebases

---

## 🛠️ DevOps e Infraestrutura

### **DevOps**
Junção de Development (desenvolvimento) e Operations (operações). Automatizar deploy e infraestrutura.

### **CI/CD (Continuous Integration/Continuous Deployment)**
- **CI**: Código testado automaticamente quando enviado
- **CD**: Código automaticamente colocado em produção se testes passarem

### **Pipeline**
Sequência automatizada de etapas. Como linha de produção industrial.
```
Código → Testes → Build → Deploy → Monitoramento
```

### **Container/Docker**
"Caixa" que contém aplicação + todas dependências. Funciona igual em qualquer lugar.
- **Analogia**: Container de navio - mesmo container funciona em qualquer navio

### **Kubernetes (K8s)**
Orquestrador de containers. Gerencia centenas de containers automaticamente.
- **Funcionalidades**: Auto-scaling, load balancing, auto-healing

### **Infrastructure as Code (IaC)**
Infraestrutura definida em código, não clicando em interfaces.
- **Terraform**: Ferramenta popular para IaC

### **Load Balancer**
Distribui requisições entre múltiplos servidores. Como recepcionista que direciona pessoas para filas menores.

### **Auto-scaling**
Sistema automaticamente adiciona/remove servidores baseado na demanda.

---

## 🔐 Segurança

### **JWT (JSON Web Token)**
Token de autenticação que contém informações do usuário de forma segura.
```
Header.Payload.Signature
```

### **Hashing**
Transformar senha em código irreversível.
```
"minhasenha123" → "d9f8a7b6c5e4f3g2h1"
```

### **CORS (Cross-Origin Resource Sharing)**
Controla quais sites podem acessar sua API.

### **Rate Limiting**
Limita número de requisições por usuário para prevenir abuso.

### **HTTPS**
HTTP seguro com criptografia. Cadeado verde no navegador.

---

## 🌐 Web e Redes

### **CDN (Content Delivery Network)**
Rede de servidores pelo mundo que entrega conteúdo do servidor mais próximo do usuário.

### **DNS (Domain Name System)**
Traduz nomes (google.com) para endereços IP (172.217.164.100).

### **SSL/TLS**
Protocolo de segurança que criptografa dados entre navegador e servidor.

### **API Gateway**
Porta de entrada única para todas as APIs. Como recepção de prédio.

---

## 🧪 Testes e Qualidade

### **Unit Tests**
Testam pedaços pequenos de código isoladamente.
```javascript
test('somar 2 + 2 deve ser 4', () => {
  expect(soma(2, 2)).toBe(4);
});
```

### **Integration Tests**
Testam se diferentes partes funcionam juntas.

### **E2E (End-to-End) Tests**
Testam fluxo completo como usuário real faria.
- **Exemplo**: Login → Criar post → Publicar → Logout

### **Linting**
Verifica se código segue padrões de estilo.
- **ESLint**: Para JavaScript/TypeScript
- **Prettier**: Formatação automática

---

## 📈 Performance e Monitoramento

### **Metrics**
Números que mostram saúde do sistema.
- **Latência**: Tempo de resposta
- **Throughput**: Requisições por segundo
- **Error Rate**: Porcentagem de erros

### **Monitoring**
Acompanhar métricas em tempo real.
- **Alertas**: Notificação quando algo está errado

### **Profiling**
Analisar onde código gasta mais tempo/memória.

---

## 💼 Metodologias e Processos

### **Agile**
Metodologia de desenvolvimento em ciclos curtos (sprints).

### **Sprint**
Período fixo (geralmente 2 semanas) para desenvolver funcionalidades.

### **MVP (Minimum Viable Product)**
Versão mais simples do produto que ainda entrega valor.

### **Feature Flag**
Ativar/desativar funcionalidades sem novo deploy.

### **A/B Testing**
Mostrar versões diferentes para usuários diferentes para ver qual funciona melhor.

---

## 🔧 Ferramentas Específicas do Projeto

### **Turborepo**
Ferramenta para gerenciar monorepos. Acelera builds e testes.

### **pnpm**
Gerenciador de pacotes mais rápido e eficiente que npm.

### **Tailwind CSS**
Framework CSS com classes utilitárias.
```html
<div class="bg-blue-500 text-white p-4 rounded">
  <!-- Azul, texto branco, padding, bordas arredondadas -->
</div>
```

### **Shadcn/ui**
Biblioteca de componentes React baseada em Tailwind.

### **Zustand**
Biblioteca simples para gerenciar estado global.

### **Prisma Studio**
Interface visual para visualizar/editar dados do banco.

---

## 📝 Dicas de Uso

### Para Iniciantes
1. **Comece com conceitos básicos**: API, Frontend, Backend
2. **Pratique com exemplos**: Crie pequenos projetos
3. **Use este glossário**: Volte sempre que encontrar termo desconhecido

### Para Entrevistas
- Entenda diferenças entre conceitos similares (REST vs GraphQL)
- Saiba explicar com analogias simples
- Pratique desenhar arquiteturas

### Para Estudos
- Cada termo pode ser um rabbit hole de aprendizado
- Foque no que é relevante para seu papel atual
- Implemente para fixar o conhecimento

---

**💡 Dica**: Mantenha este glossário como referência rápida. Adicione novos termos conforme o projeto evolui!

**📚 Para saber mais**: Cada termo aqui pode ser pesquisado individualmente para aprofundamento. 
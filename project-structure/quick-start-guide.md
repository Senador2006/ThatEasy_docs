# Guia Rápido de Início - ThatEasy

## 🚀 Setup Inicial (5 minutos)

### 1. Pré-requisitos
```bash
# Verificar versões necessárias
node --version          # >= 20.0.0
npm --version           # >= 10.0.0
docker --version        # >= 24.0.0
git --version           # >= 2.40.0

# Instalar pnpm (se não tiver)
npm install -g pnpm@latest
```

### 2. Clone e Setup do Projeto
```bash
# 1. Clone o repositório
git clone https://github.com/sua-org/ThatEasy_FullProject.git
cd ThatEasy_FullProject

# 2. Instalar dependências (monorepo)
pnpm install

# 3. Setup ambiente de desenvolvimento
cp .env.example .env.local
# Editar .env.local com suas configurações

# 4. Subir serviços de desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# 5. Executar migrações do banco
pnpm db:migrate
pnpm db:seed

# 6. Iniciar todos os serviços
pnpm dev
```

## ⚡ Comandos Essenciais

### Desenvolvimento Diário
```bash
# Iniciar ambiente completo
pnpm dev                    # Inicia web, api, mobile

# Executar apenas uma aplicação
pnpm dev:web               # Apenas frontend web
pnpm dev:api               # Apenas backend API
pnpm dev:mobile            # Apenas app mobile

# Testes
pnpm test                  # Todos os testes
pnpm test:unit             # Testes unitários
pnpm test:e2e              # Testes end-to-end

# Code quality
pnpm lint                  # ESLint
pnpm type-check            # TypeScript
pnpm format                # Prettier
```

### Database Operations
```bash
# Migrations
pnpm db:migrate            # Executar migrações
pnpm db:migrate:reset      # Reset completo do DB
pnpm db:seed               # Popular com dados iniciais

# Prisma Studio (visualizar dados)
pnpm db:studio             # Abre em http://localhost:5555

# Gerar tipos após mudanças no schema
pnpm db:generate
```

## 📂 Estrutura de Pastas Rápida

```
ThatEasy_FullProject/
├── 🌐 apps/web/           → Frontend Next.js (porta 3000)
├── 📱 apps/mobile/        → App React Native 
├── 🔧 apps/api/           → Backend Fastify (porta 3001)
├── ⚙️ apps/admin/         → Admin Panel (porta 3002)
├── 🎨 packages/ui/        → Design System
├── 📊 packages/database/  → Prisma Schema
├── 🤖 packages/ai/        → Serviços de IA
└── 🏗️ infrastructure/     → DevOps configs
```

## 🔧 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend Web** | http://localhost:3000 | Interface principal |
| **Backend API** | http://localhost:3001 | API REST + GraphQL |
| **Admin Panel** | http://localhost:3002 | Painel administrativo |
| **Prisma Studio** | http://localhost:5555 | Visualizador do DB |
| **API Docs** | http://localhost:3001/docs | Swagger/OpenAPI |
| **Storybook** | http://localhost:6006 | Design System |

## 🐛 Debugging e Logs

### Backend API
```bash
# Logs em tempo real
pnpm logs:api

# Debug mode
DEBUG=* pnpm dev:api

# Análise de performance
pnpm profile:api
```

### Frontend
```bash
# Build analysis
pnpm analyze:web

# TypeScript checking
pnpm type-check:web

# Bundle size
pnpm bundle-size:web
```

### Database
```bash
# Verificar conexão
pnpm db:ping

# Backup local
pnpm db:backup

# Restore backup
pnpm db:restore backup.sql
```

## 🚀 Primeiro Feature (Tutorial)

### Cenário: Adicionar novo tipo de post "Podcast"

#### 1. Backend - Atualizar Schema
```bash
# 1. Editar packages/database/prisma/schema.prisma
# Adicionar 'podcast' ao enum content_type

# 2. Criar migração
cd packages/database
pnpm db:migrate dev --name add-podcast-type

# 3. Gerar tipos
pnpm db:generate
```

#### 2. API - Adicionar Endpoint
```typescript
// apps/api/src/routes/posts/index.ts
export async function createPost(request: FastifyRequest, reply: FastifyReply) {
  const { content_type } = request.body;
  
  // Validar se é podcast
  if (content_type === 'podcast') {
    // Lógica específica para podcast
  }
}
```

#### 3. Frontend - UI Component
```typescript
// apps/web/src/components/PostCreate.tsx
import { PostType } from '@thateasy/types';

const POST_TYPES: PostType[] = [
  'article', 'video', 'book', 'podcast' // ← Adicionar aqui
];
```

#### 4. Testar
```bash
# 1. Testar API
pnpm test:api posts

# 2. Testar Frontend
pnpm test:web PostCreate

# 3. Teste E2E
pnpm test:e2e create-podcast-post
```

## 📱 Desenvolvimento Mobile

### Setup React Native
```bash
# Android (primeiro desenvolvimento)
cd apps/mobile
npx expo install

# iOS (requer macOS)
cd apps/mobile && npx expo run:ios

# Web preview
npx expo start --web
```

### Debugging Mobile
```bash
# React Native Debugger
npx react-native log-android    # Logs Android
npx react-native log-ios        # Logs iOS

# Expo DevTools
npx expo start --dev-client
```

## 🤖 Integração com IA

### Setup OpenAI
```bash
# 1. Configurar chave da API
echo "OPENAI_API_KEY=sk-..." >> .env.local

# 2. Testar conexão
pnpm test:ai connection

# 3. Executar primeiro prompt
pnpm ai:test "Explique machine learning"
```

### Setup Pinecone (Vector DB)
```bash
# 1. Configurar Pinecone
echo "PINECONE_API_KEY=..." >> .env.local
echo "PINECONE_ENVIRONMENT=us-east-1-aws" >> .env.local

# 2. Criar índice
pnpm ai:setup-index

# 3. Popular com dados de exemplo
pnpm ai:seed-vectors
```

## 🔍 Troubleshooting Comum

### Problema: Erro de conexão com PostgreSQL
```bash
# Solução: Reiniciar containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d

# Verificar se PostgreSQL está rodando
docker ps | grep postgres
```

### Problema: "Module not found" em packages
```bash
# Solução: Rebuild dependências
pnpm clean
pnpm install
pnpm build
```

### Problema: Conflitos de porta
```bash
# Verificar portas em uso
lsof -i :3000    # Web
lsof -i :3001    # API
lsof -i :5432    # PostgreSQL

# Matar processo específico
kill -9 $(lsof -ti:3000)
```

### Problema: TypeScript errors após mudanças
```bash
# Regenerar todos os tipos
pnpm generate:types

# Verificar tipos em toda a codebase
pnpm type-check
```

## 📚 Recursos Úteis

### Documentação Técnica
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Fastify Documentation](https://www.fastify.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)

### Ferramentas de Desenvolvimento
- **VS Code Extensions**: TypeScript, Prisma, ESLint, Prettier
- **Chrome DevTools**: React DevTools, Redux DevTools
- **Database**: Prisma Studio, pgAdmin
- **API Testing**: Thunder Client, Postman

### Comunidade e Suporte
- **GitHub Issues**: Para bugs e feature requests
- **Discord**: Chat da equipe de desenvolvimento
- **Slack**: Comunicação assíncrona
- **Notion**: Documentação interna e roadmap

## ✅ Checklist Primeiro Dia

- [ ] ✅ Setup completo funcionando (`pnpm dev`)
- [ ] 🌐 Frontend acessível em localhost:3000
- [ ] 🔧 API respondendo em localhost:3001
- [ ] 📊 Database conectado e migrado
- [ ] 🤖 IA integrada e testada
- [ ] 📱 Mobile app rodando (Expo)
- [ ] 🧪 Testes passando (`pnpm test`)
- [ ] 📝 Primeiro commit feito

**Próximos passos**: Escolher uma feature do backlog e começar a desenvolver! 🚀

---

**Dica**: Mantenha este guia sempre atualizado conforme o projeto evolui! 
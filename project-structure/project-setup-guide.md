# Guia de Setup Inicial - ThatEasy

## 🚀 Setup do Ambiente de Desenvolvimento

### **Pré-requisitos do Sistema**

#### **Ferramentas Obrigatórias**
```bash
# Node.js (versão 20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm (package manager)
npm install -g pnpm@latest

# Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Git (se não instalado)
sudo apt-get install git
```

#### **Ferramentas Recomendadas**
- **VS Code** com extensões:
  - TypeScript and JavaScript Language Features
  - Prisma
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - GitLens

## 📁 Estrutura do Projeto

### **Criação do Monorepo**
```bash
# 1. Criar repositório principal
mkdir thateasy-project
cd thateasy-project

# 2. Inicializar git
git init
git remote add origin https://github.com/your-org/thateasy.git

# 3. Estrutura inicial
mkdir -p packages/{frontend,backend,mobile,shared}
mkdir -p apps docs tools

# 4. Configurar package.json root
```

#### **package.json (Root)**
```json
{
  "name": "thateasy-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^1.11.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  },
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "packageManager": "pnpm@8.10.0"
}
```

#### **turbo.json**
```json
{
  "schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

## 🗃️ Setup do Banco de Dados

### **Docker Compose para Desenvolvimento**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: thateasy_dev
      POSTGRES_USER: thateasy
      POSTGRES_PASSWORD: thateasy123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
```

### **Inicializar Banco de Dados**
```bash
# 1. Subir containers
docker-compose -f docker-compose.dev.yml up -d

# 2. Verificar status
docker-compose -f docker-compose.dev.yml ps

# 3. Testar conexão
psql -h localhost -U thateasy -d thateasy_dev
```

## 📦 Setup dos Packages

### **1. Shared Package (Base)**
```bash
cd packages/shared

# package.json
cat > package.json << EOF
{
  "name": "@thateasy/shared",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsup": "^7.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Estrutura inicial
mkdir -p src/{types,utils,constants}

# Types básicos
cat > src/types/index.ts << EOF
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
EOF

# Utils básicos
cat > src/utils/index.ts << EOF
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
EOF

# Index principal
cat > src/index.ts << EOF
export * from './types';
export * from './utils';
export * from './constants';
EOF

# Instalar dependências
pnpm install
```

### **2. Backend Package**
```bash
cd packages/backend

# package.json
cat > package.json << EOF
{
  "name": "@thateasy/backend",
  "version": "0.1.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src/server.ts --format cjs",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@thateasy/shared": "workspace:*",
    "fastify": "^4.24.0",
    "@fastify/cors": "^8.4.0",
    "@fastify/helmet": "^11.1.0",
    "@fastify/jwt": "^7.2.0",
    "@fastify/rate-limit": "^9.0.0",
    "@fastify/websocket": "^8.3.0",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0",
    "bcryptjs": "^2.4.3",
    "redis": "^4.6.0",
    "openai": "^4.20.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "tsup": "^7.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Estrutura inicial
mkdir -p src/{routes,services,middleware,types,utils}

# Server básico
cat > src/server.ts << EOF
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

const fastify = Fastify({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
});

// Plugins
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
});

fastify.register(helmet, {
  contentSecurityPolicy: false
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(\`Server running on port \${port}\`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
EOF

# Prisma schema
cat > prisma/schema.prisma << EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts Post[]

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("posts")
}
EOF

# Environment
cat > .env << EOF
DATABASE_URL="postgresql://thateasy:thateasy123@localhost:5432/thateasy_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
OPENAI_API_KEY="your-openai-api-key"
PORT=3001
EOF

# Instalar e setup
pnpm install
pnpm db:generate
pnpm db:push
```

### **3. Frontend Package**
```bash
cd packages/frontend

# Criar Next.js app
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"

# Atualizar package.json
cat > package.json << EOF
{
  "name": "@thateasy/frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@thateasy/shared": "workspace:*",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "lucide-react": "^0.292.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Layout básico
cat > src/app/layout.tsx << EOF
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThatEasy - Rede Social Educacional',
  description: 'Plataforma para compartilhamento de conhecimento',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF

# Página inicial
cat > src/app/page.tsx << EOF
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            That<span className="text-indigo-600">Easy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A rede social educacional que conecta estudantes, 
            educadores e pesquisadores em uma plataforma colaborativa.
          </p>
          <div className="space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold">
              Começar Agora
            </button>
            <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg font-semibold">
              Saiba Mais
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
EOF

# Environment
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF

pnpm install
```

### **4. Mobile Package**
```bash
cd packages/mobile

# Criar React Native app com Expo
pnpm create expo-app@latest . --template blank-typescript

# Atualizar package.json
cat > package.json << EOF
{
  "name": "@thateasy/mobile",
  "version": "0.1.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo export",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@thateasy/shared": "workspace:*",
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "@tanstack/react-query": "^5.0.0",
    "nativewind": "^2.0.11"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "3.3.2"
  }
}
EOF

# App.tsx básico
cat > App.tsx << EOF
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ThatEasy Mobile</Text>
      <Text style={styles.subtitle}>
        Rede Social Educacional
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
});
EOF

pnpm install
```

## 🚀 Scripts de Automação

### **setup.sh (Script Principal)**
```bash
#!/bin/bash

echo "🚀 Configurando projeto ThatEasy..."

# Verificar pré-requisitos
command -v node >/dev/null 2>&1 || { echo "❌ Node.js não encontrado. Instale antes de continuar." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm não encontrado. Instale antes de continuar." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker não encontrado. Instale antes de continuar." >&2; exit 1; }

echo "✅ Pré-requisitos verificados"

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# Subir banco de dados
echo "🗃️ Iniciando banco de dados..."
docker-compose -f docker-compose.dev.yml up -d

# Aguardar banco estar pronto
echo "⏳ Aguardando banco de dados..."
sleep 10

# Setup do banco
echo "🔧 Configurando banco de dados..."
cd packages/backend
pnpm db:generate
pnpm db:push
cd ../..

# Build shared package
echo "🏗️ Building shared package..."
cd packages/shared
pnpm build
cd ../..

echo "✅ Setup concluído!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  pnpm dev (todos os serviços)"
echo "  pnpm dev --filter=frontend (apenas frontend)"
echo "  pnpm dev --filter=backend (apenas backend)"
echo ""
echo "Acessos:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:3001"
echo "  Prisma Studio: http://localhost:5555"
```

### **Scripts no package.json Root**
```json
{
  "scripts": {
    "setup": "./scripts/setup.sh",
    "dev": "turbo run dev",
    "dev:frontend": "turbo run dev --filter=frontend",
    "dev:backend": "turbo run dev --filter=backend",
    "dev:mobile": "turbo run dev --filter=mobile",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "db:studio": "cd packages/backend && pnpm db:studio",
    "db:reset": "cd packages/backend && pnpm db:push --force-reset",
    "clean": "turbo run clean && rm -rf node_modules packages/*/node_modules"
  }
}
```

## ✅ Checklist Final

### **Verificação de Setup**
- [ ] Node.js 20+ instalado
- [ ] pnpm instalado globalmente
- [ ] Docker e Docker Compose funcionando
- [ ] Repositório clonado/criado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Banco de dados rodando (docker-compose up)
- [ ] Prisma configurado e migrations rodadas
- [ ] Frontend acessível em localhost:3000
- [ ] Backend acessível em localhost:3001
- [ ] Mobile rodando no Expo

### **Testes de Funcionalidade**
```bash
# Teste backend
curl http://localhost:3001/health

# Teste banco
cd packages/backend && pnpm db:studio

# Teste build
pnpm build

# Teste lint
pnpm lint
```

### **Primeiros Passos**
1. **Estudar a documentação**: Leia todos os arquivos .md criados
2. **Entender a arquitetura**: Analise a estrutura do monorepo
3. **Primeira feature**: Implemente autenticação básica
4. **Testes**: Adicione testes unitários e de integração
5. **Deploy**: Configure CI/CD para staging

Este guia garante que qualquer membro da equipe possa configurar o ambiente de desenvolvimento rapidamente e começar a contribuir para o projeto ThatEasy.

# Guia de Tecnologias Avançadas - ThatEasy

## 🤖 OpenAI GPT-4 Integration

### **Conceitos Fundamentais**

#### **O que é GPT-4**
- **Large Language Model (LLM)** da OpenAI
- **Transformer architecture** com 175B+ parâmetros
- **Multimodal**: Processa texto e imagens
- **Context window**: 32K tokens (~25,000 palavras)

#### **Casos de Uso no ThatEasy**
- **AI Study Assistant**: Chat inteligente para ajudar estudos
- **Content Summarization**: Resumos automáticos de artigos
- **Auto-categorization**: Classificação automática de conteúdo
- **Question Generation**: Criação de perguntas para revisão

### **Implementação Prática**

#### **Setup Básico**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat completion básico
async function chatWithAssistant(message: string, context?: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Você é um assistente de estudos especializado em ${context || 'educação'}. 
                 Seja didático, claro e adapte sua linguagem ao nível do estudante.`
      },
      {
        role: "user",
        content: message
      }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content;
}
```

#### **Streaming Responses**
```typescript
async function streamResponse(message: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}
```

#### **Function Calling (Ferramentas)**
```typescript
const tools = [
  {
    type: "function" as const,
    function: {
      name: "search_content",
      description: "Busca conteúdo relacionado no banco de dados",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Termo de busca" },
          topic: { type: "string", description: "Tópico específico" }
        },
        required: ["query"]
      }
    }
  }
];

async function assistantWithTools(message: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
    tools: tools,
    tool_choice: "auto",
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  if (toolCall?.function.name === "search_content") {
    const args = JSON.parse(toolCall.function.arguments);
    const searchResults = await searchDatabase(args.query, args.topic);
    
    // Segunda chamada com os resultados
    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: message },
        completion.choices[0].message,
        {
          role: "tool",
          content: JSON.stringify(searchResults),
          tool_call_id: toolCall.id
        }
      ]
    });
    
    return finalResponse.choices[0]?.message?.content;
  }
}
```

### **Gerenciamento de Custos**
```typescript
// Sistema de cache para respostas similares
import { createHash } from 'crypto';

class OpenAICache {
  private cache = new Map<string, any>();
  
  private getCacheKey(prompt: string, model: string): string {
    return createHash('sha256').update(`${model}:${prompt}`).digest('hex');
  }
  
  async getCachedResponse(prompt: string, model: string) {
    const key = this.getCacheKey(prompt, model);
    return this.cache.get(key);
  }
  
  setCachedResponse(prompt: string, model: string, response: any) {
    const key = this.getCacheKey(prompt, model);
    this.cache.set(key, response);
  }
}

// Rate limiting por usuário
class OpenAIRateLimiter {
  private userLimits = new Map<string, { count: number, resetTime: number }>();
  
  canMakeRequest(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.userLimits.get(userId);
    
    if (!userLimit || now > userLimit.resetTime) {
      this.userLimits.set(userId, { count: 1, resetTime: now + 3600000 }); // 1 hora
      return true;
    }
    
    if (userLimit.count < 50) { // 50 requests per hour
      userLimit.count++;
      return true;
    }
    
    return false;
  }
}
```

## 🔍 Pinecone Vector Database

### **Conceitos Fundamentais**

#### **O que são Vector Databases**
- **Embeddings**: Representações numéricas de texto/dados
- **Similarity Search**: Busca por semelhança matemática
- **High-dimensional vectors**: Vetores com 1536+ dimensões
- **Approximate Nearest Neighbor**: Algoritmos de busca eficientes

#### **Vantagens do Pinecone**
- **Managed service**: Sem necessidade de infrastructure management
- **Real-time updates**: Inserções e updates instantâneos
- **Hybrid search**: Combina vector search com metadata filtering
- **Scale automático**: Escala conforme necessidade

### **Implementação Prática**

#### **Setup e Configuração**
```typescript
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Criar índice (uma vez só)
async function createIndex() {
  await pinecone.createIndex({
    name: 'thateasy-content',
    dimension: 1536, // OpenAI embedding dimension
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    }
  });
}
```

#### **Gerando Embeddings**
```typescript
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  
  return response.data[0].embedding;
}

// Processar conteúdo para embeddings
async function processContentForSearch(content: {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: string;
  difficulty: string;
}) {
  // Combinar texto relevante
  const textToEmbed = `${content.title}\n\n${content.body}\n\nTags: ${content.tags.join(', ')}`;
  
  const embedding = await generateEmbedding(textToEmbed);
  
  return {
    id: content.id,
    values: embedding,
    metadata: {
      title: content.title,
      author: content.author,
      tags: content.tags,
      difficulty: content.difficulty,
      content_type: 'article'
    }
  };
}
```

#### **Inserir e Buscar Dados**
```typescript
const index = pinecone.index('thateasy-content');

// Inserir conteúdo
async function insertContent(content: any) {
  const vectorData = await processContentForSearch(content);
  
  await index.upsert([vectorData]);
}

// Busca semântica
async function semanticSearch(query: string, filters?: any) {
  const queryEmbedding = await generateEmbedding(query);
  
  const searchResults = await index.query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
    filter: filters // e.g., { difficulty: 'beginner' }
  });
  
  return searchResults.matches?.map(match => ({
    id: match.id,
    score: match.score,
    title: match.metadata?.title,
    author: match.metadata?.author,
    tags: match.metadata?.tags,
  }));
}

// Busca híbrida (vector + filtros)
async function hybridSearch(query: string, options: {
  tags?: string[];
  difficulty?: string;
  author?: string;
  contentType?: string;
}) {
  const filters: any = {};
  
  if (options.tags?.length) {
    filters.tags = { $in: options.tags };
  }
  if (options.difficulty) {
    filters.difficulty = options.difficulty;
  }
  if (options.author) {
    filters.author = options.author;
  }
  
  return await semanticSearch(query, filters);
}
```

### **Padrões Avançados**

#### **Chunking de Conteúdo**
```typescript
// Para conteúdo muito longo, dividir em chunks
function chunkContent(text: string, maxTokens: number = 1000): string[] {
  const sentences = text.split(/[.!?]+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxTokens * 4) { // ~4 chars per token
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '. ';
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

async function insertLongContent(content: any) {
  const chunks = chunkContent(content.body);
  const vectorPromises = chunks.map(async (chunk, index) => {
    const textToEmbed = `${content.title}\n\n${chunk}`;
    const embedding = await generateEmbedding(textToEmbed);
    
    return {
      id: `${content.id}_chunk_${index}`,
      values: embedding,
      metadata: {
        ...content.metadata,
        chunk_index: index,
        total_chunks: chunks.length,
        chunk_text: chunk
      }
    };
  });
  
  const vectors = await Promise.all(vectorPromises);
  await index.upsert(vectors);
}
```

## ⚡ Fastify High-Performance Framework

### **Por que Fastify vs Express**

#### **Performance Benchmark**
```
Fastify: ~65,000 requests/sec
Express: ~15,000 requests/sec
(4x mais rápido em média)
```

#### **Principais Vantagens**
- **TypeScript nativo**: Suporte completo sem setup adicional
- **Schema-based validation**: Validação automática com JSON Schema
- **Plugin ecosystem**: Arquitetura modular robusta
- **Built-in serialization**: Serialização JSON otimizada

### **Implementação Prática**

#### **Setup Básico com TypeScript**
```typescript
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const fastify: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
});

// Schema para validação automática
const userSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    name: { type: 'string', minLength: 2 }
  }
};

// Route com validação automática
fastify.post('/users', {
  schema: {
    body: userSchema,
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' }
        }
      }
    }
  }
}, async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
  const { email, password, name } = request.body;
  
  // Fastify já validou o body automaticamente
  const user = await createUser({ email, password, name });
  
  reply.code(201).send({
    id: user.id,
    email: user.email,
    name: user.name
  });
});
```

#### **Plugin System**
```typescript
// Plugin para autenticação JWT
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

const authPlugin = fp(async function (fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET!
  });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});

// Registrar plugin
await fastify.register(authPlugin);

// Usar em routes
fastify.get('/profile', {
  preHandler: [fastify.authenticate]
}, async (request: FastifyRequest, reply: FastifyReply) => {
  return { user: request.user };
});
```

#### **WebSocket Integration**
```typescript
import websocket from '@fastify/websocket';

await fastify.register(websocket);

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    connection.socket.on('message', message => {
      // Echo message back
      connection.socket.send(`Echo: ${message}`);
    });
    
    connection.socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
});

// Real-time notifications
class NotificationService {
  private connections = new Set<WebSocket>();
  
  addConnection(ws: WebSocket) {
    this.connections.add(ws);
    ws.on('close', () => this.connections.delete(ws));
  }
  
  broadcast(message: any) {
    const data = JSON.stringify(message);
    this.connections.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    });
  }
}
```

### **Middleware e Hooks**
```typescript
// Request/Response hooks
fastify.addHook('preHandler', async (request, reply) => {
  // Log all requests
  request.log.info(`${request.method} ${request.url}`);
});

fastify.addHook('onResponse', async (request, reply) => {
  // Log response time
  request.log.info(`Response time: ${reply.getResponseTime()}ms`);
});

// Error handler global
fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation
    });
  } else {
    request.log.error(error);
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong'
    });
  }
});
```

## 🏗️ Turborepo Monorepo Management

### **Estrutura do Monorepo**
```
packages/
├── frontend/          # Next.js app
├── mobile/           # React Native app
├── backend/          # Fastify API
├── shared/           # Shared utilities
│   ├── types/        # TypeScript types
│   ├── utils/        # Common functions
│   └── ui/           # Shared components
└── config/           # Shared configs
    ├── eslint/
    ├── typescript/
    └── tailwind/
```

### **Turborepo Configuration**
```json
// turbo.json
{
  "schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### **Package Management**
```json
// package.json (root)
{
  "name": "thateasy-monorepo",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "workspaces": [
    "packages/*"
  ]
}

// package.json (shared)
{
  "name": "@thateasy/shared",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./types": "./dist/types.js",
    "./utils": "./dist/utils.js"
  }
}
```

### **Cross-Package Dependencies**
```typescript
// Em packages/frontend/package.json
{
  "dependencies": {
    "@thateasy/shared": "workspace:*"
  }
}

// Usar em frontend
import { User, ApiResponse } from '@thateasy/shared/types';
import { formatDate, debounce } from '@thateasy/shared/utils';
```

## 🔧 Prisma ORM Advanced Patterns

### **Schema Design**
```prisma
// schema.prisma
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
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  posts     Post[]
  comments  Comment[]
  likes     Like[]
  follows   Follow[] @relation("UserFollows")
  followers Follow[] @relation("UserFollowers")
  
  @@map("users")
}

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  authorId    String
  author      User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments    Comment[]
  likes       Like[]
  tags        PostTag[]
  
  // Full-text search
  @@map("posts")
  @@index([published, createdAt])
}
```

### **Advanced Queries**
```typescript
// Queries complexas com Prisma
class PostService {
  async getPostsWithEngagement(userId: string, take: number = 20) {
    return await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { likes: true, comments: true }
        },
        likes: {
          where: { userId },
          select: { id: true }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      take
    });
  }
  
  async getRecommendedPosts(userId: string) {
    // Buscar posts de usuários que o user segue
    return await prisma.post.findMany({
      where: {
        published: true,
        author: {
          followers: {
            some: { followerId: userId }
          }
        }
      },
      include: {
        author: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });
  }
}
```

### **Database Migrations**
```sql
-- Migration para full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índice para busca full-text
CREATE INDEX posts_search_idx ON posts 
USING GIN (to_tsvector('portuguese', title || ' ' || content));

-- Function para busca avançada
CREATE OR REPLACE FUNCTION search_posts(search_query text)
RETURNS TABLE(id text, title text, content text, rank real) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    ts_rank(to_tsvector('portuguese', p.title || ' ' || p.content), plainto_tsquery('portuguese', search_query)) as rank
  FROM posts p
  WHERE to_tsvector('portuguese', p.title || ' ' || p.content) @@ plainto_tsquery('portuguese', search_query)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;
```

Este guia cobre as tecnologias mais complexas do projeto ThatEasy, fornecendo implementações práticas e padrões avançados para garantir que a equipe tenha o conhecimento necessário para implementar essas soluções de forma eficiente.

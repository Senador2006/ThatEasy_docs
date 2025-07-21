# API Specification - ThatEasy

## 🌐 Base URL
```
Production: https://api.thateasy.com/v1
Development: http://localhost:3001/v1
```

## 🔐 Autenticação

### JWT Authentication
```http
Authorization: Bearer <token>
```

### Rate Limiting
- **Free users**: 100 requests/minute
- **Premium users**: 1000 requests/minute
- **Institutional**: 10000 requests/minute

## 📋 Endpoints

### Authentication

#### POST /auth/register
Registrar novo usuário
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "fullName": "John Doe",
  "accountType": "student",
  "studyLevel": "undergraduate"
}
```

#### POST /auth/login
Login do usuário
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### POST /auth/refresh
Renovar token JWT

#### POST /auth/logout
Logout e invalidar token

#### POST /auth/forgot-password
Solicitar reset de senha

#### POST /auth/reset-password
Confirmar reset de senha

### Users

#### GET /users/me
Obter perfil do usuário atual

#### PUT /users/me
Atualizar perfil do usuário
```json
{
  "fullName": "John Doe Updated",
  "bio": "Estudante de Ciência da Computação...",
  "location": "São Paulo, Brasil",
  "website": "https://johndoe.dev"
}
```

#### GET /users/{username}
Obter perfil público de usuário

#### GET /users/{username}/posts
Obter posts de um usuário
- **Query params**: `page`, `limit`, `contentType`, `status`

#### GET /users/{username}/followers
Obter seguidores de um usuário

#### GET /users/{username}/following
Obter usuários seguidos

#### POST /users/{username}/follow
Seguir usuário

#### DELETE /users/{username}/follow
Deixar de seguir usuário

#### GET /users/search
Buscar usuários
- **Query params**: `q`, `accountType`, `studyLevel`, `location`

### Posts

#### GET /posts
Listar posts do feed
- **Query params**: `page`, `limit`, `contentType`, `tags`, `difficulty`, `language`

#### POST /posts
Criar novo post
```json
{
  "title": "Introdução ao Machine Learning",
  "content": "Conteúdo do post...",
  "contentType": "article",
  "tags": ["machine-learning", "python", "ai"],
  "difficultyLevel": "intermediate",
  "readingTime": 15,
  "mediaUrls": ["https://example.com/image.jpg"],
  "externalUrl": "https://example.com/full-article"
}
```

#### GET /posts/{id}
Obter post específico

#### PUT /posts/{id}
Atualizar post
```json
{
  "title": "Título atualizado",
  "content": "Conteúdo atualizado...",
  "tags": ["new-tag", "updated-tag"]
}
```

#### DELETE /posts/{id}
Deletar post

#### POST /posts/{id}/like
Curtir post

#### DELETE /posts/{id}/like
Descurtir post

#### POST /posts/{id}/bookmark
Favoritar post
```json
{
  "collectionName": "ML Articles"
}
```

#### DELETE /posts/{id}/bookmark
Desfavoritar post

#### POST /posts/{id}/share
Compartilhar post

#### GET /posts/{id}/comments
Obter comentários do post

#### POST /posts/{id}/comments
Comentar em post
```json
{
  "content": "Excelente artigo! Muito esclarecedor.",
  "parentId": null
}
```

#### GET /posts/trending
Obter posts em alta
- **Query params**: `period` (hour, day, week, month)

#### GET /posts/recommendations
Obter posts recomendados para o usuário

### Comments

#### PUT /comments/{id}
Atualizar comentário
```json
{
  "content": "Comentário atualizado..."
}
```

#### DELETE /comments/{id}
Deletar comentário

#### POST /comments/{id}/like
Curtir comentário

#### DELETE /comments/{id}/like
Descurtir comentário

### Tags

#### GET /tags
Listar todas as tags
- **Query params**: `category`, `popular`, `search`

#### GET /tags/{slug}
Obter tag específica

#### GET /tags/{slug}/posts
Obter posts de uma tag

#### GET /tags/trending
Obter tags em alta

### Search

#### GET /search
Busca universal
- **Query params**: `q`, `type` (posts, users, tags), `filters`

#### GET /search/posts
Buscar posts
```json
{
  "query": "machine learning",
  "filters": {
    "contentType": ["article", "video"],
    "difficultyLevel": ["intermediate", "advanced"],
    "tags": ["python", "ai"],
    "dateRange": {
      "from": "2024-01-01",
      "to": "2024-12-31"
    }
  },
  "sort": "relevance", // relevance, date, engagement
  "page": 1,
  "limit": 20
}
```

#### GET /search/users
Buscar usuários

#### POST /search/semantic
Busca semântica com IA
```json
{
  "query": "Como aprender programação para iniciantes?",
  "context": "beginner_friendly",
  "limit": 10
}
```

### Study Groups

#### GET /study-groups
Listar grupos de estudo
- **Query params**: `category`, `isPrivate`, `search`

#### POST /study-groups
Criar grupo de estudo
```json
{
  "name": "Python para Iniciantes",
  "description": "Grupo para estudar Python...",
  "isPrivate": false,
  "maxMembers": 30,
  "tags": ["python", "programming"]
}
```

#### GET /study-groups/{id}
Obter grupo específico

#### PUT /study-groups/{id}
Atualizar grupo

#### DELETE /study-groups/{id}
Deletar grupo

#### POST /study-groups/{id}/join
Entrar no grupo

#### DELETE /study-groups/{id}/leave
Sair do grupo

#### GET /study-groups/{id}/members
Listar membros do grupo

### Mentorship

#### GET /mentorships
Listar mentorias do usuário

#### POST /mentorships
Solicitar mentoria
```json
{
  "mentorId": "uuid",
  "subjectArea": "Machine Learning",
  "message": "Gostaria de aprender sobre ML..."
}
```

#### PUT /mentorships/{id}
Atualizar status da mentoria
```json
{
  "status": "active"
}
```

#### GET /mentors
Buscar mentores
- **Query params**: `subjectArea`, `experience`, `rating`

### Notifications

#### GET /notifications
Listar notificações
- **Query params**: `read`, `type`, `page`, `limit`

#### PUT /notifications/{id}/read
Marcar notificação como lida

#### PUT /notifications/read-all
Marcar todas como lidas

#### DELETE /notifications/{id}
Deletar notificação

### AI Assistant

#### POST /ai/chat
Conversar com assistente IA
```json
{
  "message": "Explique o conceito de recursão em programação",
  "context": {
    "postId": "uuid",
    "conversationId": "uuid"
  }
}
```

#### POST /ai/summarize
Resumir conteúdo
```json
{
  "content": "Texto longo para resumir...",
  "maxLength": 200
}
```

#### POST /ai/generate-tags
Gerar tags para conteúdo
```json
{
  "title": "Introdução ao Machine Learning",
  "content": "Conteúdo do post..."
}
```

### Analytics

#### GET /analytics/dashboard
Dashboard de analytics do usuário

#### GET /analytics/posts/{id}
Analytics de post específico

#### GET /analytics/engagement
Métricas de engajamento

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## 🔒 Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## 📱 WebSocket Events

### Real-time Notifications
```javascript
// Client connects to
wss://api.thateasy.com/ws?token=<jwt_token>

// Events
{
  "type": "notification",
  "data": {
    "id": "uuid",
    "type": "like",
    "message": "João curtiu seu post",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

{
  "type": "new_message",
  "data": {
    "conversationId": "uuid",
    "message": "Nova mensagem..."
  }
}
```

## 🔧 SDK Examples

### JavaScript/TypeScript
```typescript
import { ThatEasyAPI } from '@thateasy/sdk';

const api = new ThatEasyAPI({
  baseURL: 'https://api.thateasy.com/v1',
  apiKey: 'your-api-key'
});

// Criar post
const post = await api.posts.create({
  title: 'Meu novo artigo',
  content: 'Conteúdo...',
  contentType: 'article',
  tags: ['javascript', 'react']
});

// Buscar posts
const posts = await api.posts.search({
  query: 'react hooks',
  filters: {
    contentType: ['article'],
    difficultyLevel: ['intermediate']
  }
});
``` 
# Diagramas de Sistema - ThatEasy

Este documento contém todos os diagramas de arquitetura e fluxos do sistema da rede social educacional ThatEasy.

## 📋 Índice

1. [Arquitetura Geral do Sistema](#1-arquitetura-geral-do-sistema)
2. [Fluxo de Autenticação](#2-fluxo-de-autenticação)
3. [Fluxo de Publicação de Conteúdo](#3-fluxo-de-publicação-de-conteúdo)
4. [Fluxo de Interações Sociais](#4-fluxo-de-interações-sociais)
5. [Sistema de Busca e Recomendações](#5-sistema-de-busca-e-recomendações)
6. [Notificações em Tempo Real](#6-notificações-em-tempo-real)
7. [Sistema de Gamificação](#7-sistema-de-gamificação)
8. [Grupos de Estudo e Mentoria](#8-grupos-de-estudo-e-mentoria)

---

## 1. Arquitetura Geral do Sistema

Este diagrama mostra a visão macro de todos os componentes do ThatEasy, incluindo cliente, backend, bancos de dados e serviços externos.

```mermaid
graph TB
    subgraph "Cliente"
        WEB[Web App<br/>Next.js + TypeScript]
        PWA[Progressive Web App<br/>Offline Support]
        MOBILE[Mobile Browser<br/>Responsive UI]
    end
    
    subgraph "Load Balancer & CDN"
        LB[Load Balancer]
        CDN[CloudFront CDN<br/>Static Assets]
    end
    
    subgraph "Backend Services"
        API[API Gateway<br/>Fastify + Node.js]
        AUTH[Authentication Service<br/>JWT + OAuth]
        WS[WebSocket Server<br/>Real-time Events]
        AI[AI Service<br/>GPT-4 + ML Models]
    end
    
    subgraph "Databases"
        PG[(PostgreSQL<br/>Main Database)]
        REDIS[(Redis<br/>Cache + Sessions)]
        ES[(Elasticsearch<br/>Search Index)]
        PINE[(Pinecone<br/>Vector Database)]
    end
    
    subgraph "External Services"
        S3[AWS S3<br/>Media Storage]
        OPENAI[OpenAI API<br/>GPT-4 + Whisper]
        EMAIL[Email Service<br/>Notifications]
    end
    
    subgraph "Infrastructure"
        K8S[Kubernetes<br/>Container Orchestration]
        MONITOR[Monitoring<br/>Logs + Metrics]
        BACKUP[Backup Service<br/>Database Backups]
    end
    
    %% Client connections
    WEB --> LB
    PWA --> LB  
    MOBILE --> LB
    
    %% Load balancer routing
    LB --> API
    LB --> WS
    CDN --> WEB
    
    %% API connections
    API --> AUTH
    API --> PG
    API --> REDIS
    API --> ES
    API --> AI
    API --> S3
    API --> EMAIL
    
    %% WebSocket connections
    WS --> REDIS
    WS --> PG
    
    %% AI service connections
    AI --> OPENAI
    AI --> PINE
    AI --> PG
    
    %% Infrastructure connections
    K8S --> API
    K8S --> WS
    K8S --> AI
    MONITOR --> K8S
    BACKUP --> PG
    
    classDef client fill:#e1f5fe
    classDef backend fill:#fff3e0
    classDef database fill:#f3e5f5
    classDef external fill:#e8f5e8
    classDef infra fill:#fce4ec
    
    class WEB,PWA,MOBILE client
    class API,AUTH,WS,AI backend
    class PG,REDIS,ES,PINE database
    class S3,OPENAI,EMAIL external
    class K8S,MONITOR,BACKUP infra
```

**Componentes principais:**
- **Frontend**: Next.js PWA com TypeScript
- **Backend**: Microserviços com Fastify
- **Dados**: PostgreSQL, Redis, Elasticsearch, Pinecone
- **IA**: OpenAI GPT-4 integrado
- **Infraestrutura**: Kubernetes + AWS

---

## 2. Fluxo de Autenticação

Fluxo completo de registro, login, acesso a recursos protegidos e logout.

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as Cliente (Frontend)
    participant API as API Gateway
    participant AUTH as Auth Service
    participant DB as PostgreSQL
    participant REDIS as Redis Cache
    participant EMAIL as Email Service

    Note over U,EMAIL: Fluxo de Autenticação Completo

    %% Registro
    rect rgb(240, 248, 255)
        Note over U,EMAIL: 1. REGISTRO DE USUÁRIO
        U->>C: Preenche formulário de registro
        C->>API: POST /auth/register
        API->>AUTH: Valida dados do usuário
        AUTH->>DB: Verifica se email/username existe
        alt Email já existe
            DB-->>AUTH: Usuário existe
            AUTH-->>API: Erro 409 - Conflict
            API-->>C: Email já cadastrado
            C-->>U: Mostra erro
        else Email disponível
            AUTH->>DB: Cria novo usuário
            DB-->>AUTH: Usuário criado com sucesso
            AUTH->>EMAIL: Envia email de verificação
            AUTH-->>API: Token de verificação
            API-->>C: Sucesso + instruções
            C-->>U: "Verifique seu email"
        end
    end

    %% Login
    rect rgb(240, 255, 240)
        Note over U,EMAIL: 2. LOGIN DO USUÁRIO
        U->>C: Insere email e senha
        C->>API: POST /auth/login
        API->>AUTH: Processa login
        AUTH->>DB: Busca usuário por email
        DB-->>AUTH: Dados do usuário
        AUTH->>AUTH: Verifica senha (bcrypt)
        alt Credenciais válidas
            AUTH->>REDIS: Armazena sessão
            AUTH-->>API: JWT Token + Refresh Token
            API-->>C: Tokens + dados do usuário
            C->>C: Armazena tokens (localStorage)
            C-->>U: Redirect para dashboard
        else Credenciais inválidas
            AUTH-->>API: Erro 401 - Unauthorized
            API-->>C: Credenciais inválidas
            C-->>U: Mostra erro de login
        end
    end

    %% Acesso protegido
    rect rgb(255, 248, 240)
        Note over U,EMAIL: 3. ACESSO A RECURSOS PROTEGIDOS
        U->>C: Navega para página protegida
        C->>API: GET /posts (com JWT Header)
        API->>AUTH: Valida JWT Token
        alt Token válido
            AUTH->>REDIS: Verifica sessão ativa
            REDIS-->>AUTH: Sessão válida
            AUTH-->>API: Usuário autenticado
            API->>DB: Busca posts do usuário
            DB-->>API: Lista de posts
            API-->>C: Posts + dados
            C-->>U: Exibe conteúdo
        else Token expirado
            AUTH-->>API: Token expirado
            API-->>C: 401 - Token expirado
            C->>API: POST /auth/refresh (com Refresh Token)
            API->>AUTH: Valida Refresh Token
            AUTH->>REDIS: Verifica refresh token
            alt Refresh Token válido
                AUTH->>AUTH: Gera novo JWT
                AUTH-->>API: Novo JWT Token
                API-->>C: Novo token
                C->>C: Atualiza token armazenado
                C->>API: Retry requisição original
            else Refresh Token inválido
                AUTH-->>API: Refresh token inválido
                API-->>C: 401 - Faça login novamente
                C->>C: Remove tokens armazenados
                C-->>U: Redirect para login
            end
        end
    end

    %% Logout
    rect rgb(255, 240, 240)
        Note over U,EMAIL: 4. LOGOUT DO USUÁRIO
        U->>C: Clica em "Sair"
        C->>API: POST /auth/logout (com JWT)
        API->>AUTH: Processa logout
        AUTH->>REDIS: Invalida sessão
        AUTH->>DB: Atualiza last_active
        AUTH-->>API: Logout bem-sucedido
        API-->>C: Confirmação
        C->>C: Remove tokens do storage
        C-->>U: Redirect para página inicial
    end
```

**Características:**
- JWT + Refresh Token para segurança
- Sessões no Redis para performance
- Email de verificação obrigatório
- Refresh automático de tokens

---

## 3. Fluxo de Publicação de Conteúdo

Como funciona a criação, processamento com IA e distribuição de posts na plataforma.

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as Cliente
    participant API as API Gateway
    participant AI as AI Service
    participant DB as PostgreSQL
    participant S3 as AWS S3
    participant ES as Elasticsearch
    participant WS as WebSocket
    participant REDIS as Redis

    Note over U,REDIS: Fluxo de Publicação de Conteúdo

    %% Criação de post
    rect rgb(240, 248, 255)
        Note over U,REDIS: 1. CRIAÇÃO DE POST
        U->>C: Escreve conteúdo + upload mídia
        C->>S3: Upload de imagens/vídeos
        S3-->>C: URLs das mídias
        C->>API: POST /posts (draft)
        API->>DB: Salva post como rascunho
        DB-->>API: Post ID criado
        API-->>C: Post salvo como draft
        C-->>U: "Rascunho salvo automaticamente"
    end

    %% Processamento com IA
    rect rgb(240, 255, 240)
        Note over U,REDIS: 2. PROCESSAMENTO COM IA
        U->>C: Clica "Sugerir tags" ou "Publicar"
        C->>API: POST /ai/generate-tags
        API->>AI: Analisa conteúdo
        AI->>AI: Processa com GPT-4
        AI-->>API: Tags sugeridas + metadados
        API-->>C: Sugestões de tags
        C-->>U: Mostra tags sugeridas
        
        U->>C: Confirma tags e publica
        C->>API: PUT /posts/{id} (status: published)
        API->>AI: Análise final do conteúdo
        AI->>AI: Calcula difficulty_level e reading_time
        AI-->>API: Metadados finais
        API->>DB: Atualiza post com status published
        DB-->>API: Post publicado
    end

    %% Indexação e distribuição
    rect rgb(255, 248, 240)
        Note over U,REDIS: 3. INDEXAÇÃO E DISTRIBUIÇÃO
        API->>ES: Indexa post para busca
        ES-->>API: Post indexado
        API->>REDIS: Cache de post + invalidação
        API->>WS: Notifica seguidores
        
        loop Para cada seguidor
            WS->>DB: Busca seguidores ativos
            DB-->>WS: Lista de seguidores
            WS->>WS: Envia notificação em tempo real
        end
        
        API-->>C: Post publicado com sucesso
        C-->>U: "Post publicado! Visível para seguidores"
    end

    %% Visualização e engajamento
    rect rgb(255, 240, 255)
        Note over U,REDIS: 4. VISUALIZAÇÃO POR OUTROS USUÁRIOS
        participant U2 as Outro Usuário
        participant C2 as Cliente 2
        
        U2->>C2: Acessa feed
        C2->>API: GET /posts (feed personalizado)
        API->>REDIS: Verifica cache do feed
        alt Cache miss
            API->>DB: Busca posts relevantes
            API->>AI: Aplica algoritmo de recomendação
            AI-->>API: Posts rankeados
            API->>REDIS: Cacheia resultado
        else Cache hit
            REDIS-->>API: Posts do cache
        end
        API-->>C2: Feed personalizado
        C2-->>U2: Exibe posts
        
        U2->>C2: Clica no post
        C2->>API: GET /posts/{id}
        API->>DB: Incrementa view_count
        API->>REDIS: Atualiza cache de estatísticas
        API-->>C2: Conteúdo completo do post
        C2-->>U2: Exibe post completo
    end
```

**Funcionalidades:**
- Auto-save de rascunhos
- IA para sugestão de tags e metadados
- Upload para S3 com CDN
- Indexação automática para busca
- Feed personalizado com ML

---

## 4. Fluxo de Interações Sociais

Sistema completo de likes, comentários, follows, compartilhamentos e bookmarks.

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as Cliente
    participant API as API Gateway
    participant DB as PostgreSQL
    participant WS as WebSocket
    participant REDIS as Redis
    participant NOTIF as Notification Service

    Note over U,NOTIF: Fluxo de Interações Sociais

    %% Like em post
    rect rgb(240, 248, 255)
        Note over U,NOTIF: 1. CURTIR POST
        U->>C: Clica no botão "curtir"
        C->>API: POST /posts/{id}/like
        API->>DB: Verifica se já curtiu
        alt Primeira vez curtindo
            API->>DB: Insere like + incrementa like_count
            DB-->>API: Like registrado
            API->>REDIS: Atualiza cache de estatísticas
            API->>WS: Notifica autor do post
            WS->>NOTIF: Cria notificação
            NOTIF->>DB: Salva notificação
            WS->>WS: Envia notificação em tempo real
            API-->>C: Like confirmado
            C->>C: Atualiza UI (botão ativo)
            C-->>U: Feedback visual imediato
        else Já curtiu (descurtir)
            API->>DB: Remove like + decrementa count
            DB-->>API: Like removido
            API->>REDIS: Atualiza cache
            API-->>C: Like removido
            C->>C: Atualiza UI (botão inativo)
        end
    end

    %% Comentário
    rect rgb(240, 255, 240)
        Note over U,NOTIF: 2. COMENTAR POST
        U->>C: Escreve comentário
        C->>API: POST /posts/{id}/comments
        API->>DB: Salva comentário + incrementa comment_count
        DB-->>API: Comentário salvo
        API->>REDIS: Invalida cache de comentários
        API->>WS: Notifica autor e mencionados
        
        loop Para menções no comentário
            WS->>NOTIF: Cria notificação de menção
            NOTIF->>DB: Salva notificação
            WS->>WS: Envia notificação real-time
        end
        
        API-->>C: Comentário publicado
        C->>C: Adiciona comentário à lista
        C-->>U: Comentário visível imediatamente
    end

    %% Seguir usuário
    rect rgb(255, 248, 240)
        Note over U,NOTIF: 3. SEGUIR USUÁRIO
        U->>C: Clica "Seguir" no perfil
        C->>API: POST /users/{username}/follow
        API->>DB: Verifica se já segue
        alt Não segue ainda
            API->>DB: Insere follow + atualiza contadores
            DB-->>API: Follow registrado
            API->>REDIS: Atualiza cache de relacionamentos
            API->>WS: Notifica usuário seguido
            WS->>NOTIF: Cria notificação de novo seguidor
            NOTIF->>DB: Salva notificação
            WS->>WS: Envia notificação em tempo real
            API-->>C: Agora seguindo
            C->>C: Atualiza botão para "Seguindo"
            C-->>U: "Agora você segue @username"
        else Já segue (deixar de seguir)
            API->>DB: Remove follow + atualiza contadores
            DB-->>API: Unfollow confirmado
            API->>REDIS: Atualiza cache
            API-->>C: Deixou de seguir
            C->>C: Atualiza botão para "Seguir"
        end
    end

    %% Compartilhamento
    rect rgb(255, 240, 255)
        Note over U,NOTIF: 4. COMPARTILHAR POST
        U->>C: Clica "Compartilhar"
        C->>C: Abre modal de compartilhamento
        U->>C: Escolhe plataforma ou compartilhamento interno
        
        alt Compartilhamento interno
            C->>API: POST /posts/{id}/share
            API->>DB: Incrementa share_count
            API->>DB: Cria post de compartilhamento
            DB-->>API: Compartilhamento registrado
            API->>WS: Notifica autor original
            WS->>NOTIF: Cria notificação de compartilhamento
            NOTIF->>DB: Salva notificação
            API-->>C: Compartilhado com sucesso
            C-->>U: "Post compartilhado no seu feed"
        else Compartilhamento externo
            C->>C: Gera link de compartilhamento
            C->>API: POST /posts/{id}/share (external)
            API->>DB: Incrementa share_count apenas
            C-->>U: Link copiado ou redirecionamento
        end
    end

    %% Bookmark/Favoritar
    rect rgb(248, 240, 255)
        Note over U,NOTIF: 5. FAVORITAR POST
        U->>C: Clica no ícone de bookmark
        C->>API: POST /posts/{id}/bookmark
        API->>DB: Verifica se já favoritou
        alt Primeira vez favoritando
            API->>DB: Insere bookmark + incrementa count
            DB-->>API: Bookmark salvo
            API->>REDIS: Atualiza cache de favoritos
            API-->>C: Post favoritado
            C->>C: Atualiza ícone (preenchido)
            C-->>U: "Salvo nos favoritos"
        else Já favoritou (remover)
            API->>DB: Remove bookmark + decrementa count
            DB-->>API: Bookmark removido
            API->>REDIS: Atualiza cache
            API-->>C: Removido dos favoritos
            C->>C: Atualiza ícone (vazio)
        end
    end
```

**Funcionalidades:**
- Feedback imediato na UI
- Notificações em tempo real
- Cache para performance
- Sistema de menções
- Contadores atualizados automaticamente

---

## 5. Sistema de Busca e Recomendações

Algoritmo inteligente que combina busca textual, semântica e personalização.

```mermaid
flowchart TD
    subgraph "Entrada do Usuário"
        SEARCH["Busca do Usuário<br/>machine learning python"]
        FILTERS["Filtros Aplicados<br/>Tipo, Dificuldade, Data"]
    end
    
    subgraph "Processamento da Busca"
        PARSE["Parser de Query<br/>Extrai termos e contexto"]
        SEMANTIC["IA Semântica<br/>Compreende intenção"]
        VECTOR["Busca Vetorial<br/>Pinecone + Embeddings"]
    end
    
    subgraph "Fontes de Dados"
        ES[("Elasticsearch<br/>Busca Textual")]
        PINE[("Pinecone<br/>Busca Semântica")]
        DB[("PostgreSQL<br/>Metadados + Relações")]
        REDIS[("Redis<br/>Cache de Resultados")]
    end
    
    subgraph "Algoritmo de Ranking"
        RELEVANCE["Relevância Textual<br/>TF-IDF + BM25"]
        SEMANTIC_SCORE["Score Semântico<br/>Similaridade Vetorial"]
        ENGAGEMENT["Métricas de Engajamento<br/>Likes, Views, Comments"]
        PERSONAL["Personalização<br/>Histórico + Interesses"]
        FRESH["Frescor<br/>Posts Recentes"]
    end
    
    subgraph "Combinação de Resultados"
        MERGER["Fusion Algorithm<br/>Combina múltiplas fontes"]
        RERANK["Re-ranking<br/>Algoritmo ML"]
        DIVERSITY["Diversificação<br/>Evita echo chamber"]
    end
    
    subgraph "Pós-processamento"
        CACHE_UPDATE["Atualiza Cache<br/>Para próximas buscas"]
        ANALYTICS["Tracking Analytics<br/>Para melhorar algoritmo"]
        PERSONALIZE["Atualiza Perfil<br/>Preferências do usuário"]
    end
    
    subgraph "Saída"
        RESULTS["Resultados Rankeados<br/>Posts + Scores"]
        SUGGESTIONS["Sugestões<br/>Termos relacionados"]
        FACETS["Facetas<br/>Filtros dinâmicos"]
    end
    
    %% Fluxo principal
    SEARCH --> PARSE
    FILTERS --> PARSE
    PARSE --> SEMANTIC
    SEMANTIC --> VECTOR
    
    %% Consulta paralela nas fontes
    VECTOR --> ES
    VECTOR --> PINE
    VECTOR --> DB
    VECTOR --> REDIS
    
    %% Processamento dos scores
    ES --> RELEVANCE
    PINE --> SEMANTIC_SCORE
    DB --> ENGAGEMENT
    DB --> PERSONAL
    PARSE --> FRESH
    
    %% Combinação
    RELEVANCE --> MERGER
    SEMANTIC_SCORE --> MERGER
    ENGAGEMENT --> MERGER
    PERSONAL --> MERGER
    FRESH --> MERGER
    
    MERGER --> RERANK
    RERANK --> DIVERSITY
    
    %% Pós-processamento
    DIVERSITY --> CACHE_UPDATE
    DIVERSITY --> ANALYTICS
    DIVERSITY --> PERSONALIZE
    
    %% Resultados finais
    DIVERSITY --> RESULTS
    DIVERSITY --> SUGGESTIONS
    DIVERSITY --> FACETS
    
    %% Feedback loop
    ANALYTICS -.-> SEMANTIC
    PERSONALIZE -.-> PERSONAL
    CACHE_UPDATE -.-> REDIS
    
    classDef input fill:#e3f2fd
    classDef processing fill:#fff3e0
    classDef data fill:#f3e5f5
    classDef algorithm fill:#e8f5e8
    classDef output fill:#fce4ec
    
    class SEARCH,FILTERS input
    class PARSE,SEMANTIC,VECTOR processing
    class ES,PINE,DB,REDIS data
    class RELEVANCE,SEMANTIC_SCORE,ENGAGEMENT,PERSONAL,FRESH,MERGER,RERANK,DIVERSITY algorithm
    class RESULTS,SUGGESTIONS,FACETS,CACHE_UPDATE,ANALYTICS,PERSONALIZE output
```

**Tecnologias:**
- Elasticsearch para busca textual
- Pinecone para busca semântica
- Machine Learning para ranking
- Cache inteligente no Redis
- Personalização baseada em comportamento

---

## 6. Notificações em Tempo Real

Sistema completo de notificações via WebSocket, push notifications e email.

```mermaid
sequenceDiagram
    participant U1 as Usuário A
    participant C1 as Cliente A
    participant U2 as Usuário B  
    participant C2 as Cliente B
    participant WS as WebSocket Server
    participant REDIS as Redis
    participant DB as PostgreSQL
    participant NOTIF as Notification Service
    participant EMAIL as Email Service
    participant PUSH as Push Service

    Note over U1,PUSH: Sistema de Notificações em Tempo Real

    %% Conexão WebSocket
    rect rgb(240, 248, 255)
        Note over U1,PUSH: 1. ESTABELECIMENTO DE CONEXÃO
        C1->>WS: Conecta WebSocket (com JWT)
        WS->>WS: Valida token JWT
        WS->>REDIS: Registra conexão ativa
        REDIS-->>WS: Conexão registrada
        WS-->>C1: Conexão estabelecida
        
        C2->>WS: Conecta WebSocket (com JWT)
        WS->>WS: Valida token JWT  
        WS->>REDIS: Registra conexão ativa
        WS-->>C2: Conexão estabelecida
    end

    %% Evento que gera notificação
    rect rgb(240, 255, 240)
        Note over U1,PUSH: 2. AÇÃO QUE GERA NOTIFICAÇÃO
        U1->>C1: Curte post do Usuário B
        C1->>WS: POST /posts/{id}/like
        WS->>DB: Registra like no banco
        DB-->>WS: Like confirmado
        
        WS->>NOTIF: Cria notificação
        NOTIF->>DB: Salva notificação
        DB-->>NOTIF: Notificação ID gerada
        NOTIF-->>WS: Notificação criada
    end

    %% Distribuição em tempo real
    rect rgb(255, 248, 240)
        Note over U1,PUSH: 3. DISTRIBUIÇÃO IMEDIATA
        WS->>REDIS: Busca usuários conectados
        REDIS-->>WS: Lista de conexões ativas
        
        alt Usuário B está online
            WS->>C2: Envia notificação via WebSocket
            C2->>C2: Mostra toast notification
            C2->>C2: Atualiza badge de notificações
            C2-->>U2: Notificação exibida imediatamente
        else Usuário B está offline
            WS->>PUSH: Envia push notification
            PUSH->>PUSH: Entrega para dispositivo móvel
            PUSH-->>U2: Push notification no celular
        end
    end

    %% Notificação por email (se configurado)
    rect rgb(255, 240, 255)
        Note over U1,PUSH: 4. NOTIFICAÇÃO POR EMAIL (OPCIONAL)
        WS->>DB: Verifica preferências do usuário
        DB-->>WS: Configurações de notificação
        
        alt Email habilitado para likes
            WS->>EMAIL: Envia email de notificação
            EMAIL->>EMAIL: Processa template
            EMAIL-->>U2: Email enviado
        else Email desabilitado
            Note over EMAIL: Email não enviado
        end
    end

    %% Sincronização quando usuário fica online
    rect rgb(248, 240, 255)
        Note over U1,PUSH: 5. SINCRONIZAÇÃO AO CONECTAR
        participant U3 as Usuário C (Offline)
        participant C3 as Cliente C
        
        Note over U3: Usuário estava offline
        C3->>WS: Conecta WebSocket
        WS->>DB: Busca notificações não lidas
        DB-->>WS: Lista de notificações pendentes
        WS->>C3: Envia notificações em lote
        C3->>C3: Processa notificações
        C3->>C3: Atualiza contador de notificações
        C3-->>U3: Badge com número de notificações
        
        U3->>C3: Clica nas notificações
        C3->>WS: PUT /notifications/read-all
        WS->>DB: Marca todas como lidas
        DB-->>WS: Notificações atualizadas
        WS-->>C3: Confirmação
        C3->>C3: Limpa badge de notificações
    end

    %% Cleanup de conexões
    rect rgb(240, 240, 240)
        Note over U1,PUSH: 6. GERENCIAMENTO DE CONEXÕES
        C1->>WS: Desconecta (fecha aba/app)
        WS->>REDIS: Remove conexão ativa
        REDIS-->>WS: Conexão removida
        
        loop Heartbeat cada 30 segundos
            WS->>C2: Ping
            alt Cliente responde
                C2->>WS: Pong
                WS->>REDIS: Atualiza timestamp da conexão
            else Cliente não responde
                WS->>REDIS: Remove conexão inativa
                Note over WS: Conexão considerada morta
            end
        end
    end
```

**Funcionalidades:**
- WebSocket para real-time
- Push notifications para offline
- Email configurável por usuário
- Sincronização automática
- Heartbeat para conexões saudáveis

---

## 7. Sistema de Gamificação

Sistema completo de pontos, conquistas, streaks, rankings e desafios personalizados.

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as Cliente
    participant API as API Gateway
    participant GAMIF as Gamification Service
    participant DB as PostgreSQL
    participant REDIS as Redis
    participant WS as WebSocket
    participant AI as AI Service

    Note over U,AI: Sistema de Gamificação e Conquistas

    %% Ação do usuário que pode gerar pontos
    rect rgb(240, 248, 255)
        Note over U,AI: 1. AÇÃO QUE GERA PONTOS
        U->>C: Publica primeiro artigo
        C->>API: POST /posts (publish)
        API->>DB: Salva post publicado
        DB-->>API: Post criado com sucesso
        
        API->>GAMIF: Evento: first_post_published
        GAMIF->>DB: Busca conquistas relacionadas
        DB-->>GAMIF: Lista de achievements aplicáveis
        
        loop Para cada achievement
            GAMIF->>GAMIF: Verifica critério
            alt Critério atingido
                GAMIF->>DB: Registra conquista do usuário
                GAMIF->>DB: Adiciona pontos ao perfil
                GAMIF->>REDIS: Atualiza cache de pontuação
            end
        end
        
        GAMIF-->>API: Conquistas desbloqueadas
        API-->>C: Post + conquistas
        C->>C: Mostra animação de conquista
        C-->>U: "Parabéns! Conquista desbloqueada"
    end

    %% Sistema de streaks
    rect rgb(240, 255, 240)
        Note over U,AI: 2. SISTEMA DE STREAKS
        U->>C: Lê artigos durante 7 dias consecutivos
        C->>API: GET /posts/{id} (tracking de leitura)
        API->>GAMIF: Evento: article_read
        GAMIF->>DB: Atualiza streak de leitura
        
        alt Novo recorde de streak
            GAMIF->>DB: Verifica achievement de streak
            DB-->>GAMIF: "7 Day Scholar" disponível
            GAMIF->>DB: Desbloqueia conquista
            GAMIF->>WS: Notifica conquista especial
            WS->>C: Push notification
            C-->>U: "Streak de 7 dias! +500 pontos"
        else Mantém streak
            GAMIF->>REDIS: Atualiza contador diário
            GAMIF-->>API: Streak mantido
            API-->>C: Contador atualizado
        end
    end

    %% Ranking e competição
    rect rgb(255, 248, 240)
        Note over U,AI: 3. RANKINGS E COMPETIÇÃO
        U->>C: Acessa página de ranking
        C->>API: GET /rankings/weekly
        API->>REDIS: Busca cache de ranking
        
        alt Cache válido
            REDIS-->>API: Ranking da semana
        else Cache expirado
            API->>DB: Calcula ranking atual
            DB-->>API: Top usuários por pontos
            API->>REDIS: Cacheia ranking (1 hora)
        end
        
        API-->>C: Ranking + posição do usuário
        C-->>U: "Você está em #15 esta semana"
    end

    %% Desafios semanais
    rect rgb(255, 240, 255)
        Note over U,AI: 4. DESAFIOS SEMANAIS
        Note over GAMIF: Sistema gera desafios automaticamente
        GAMIF->>AI: Analisa padrão do usuário
        AI->>DB: Busca histórico de atividade
        DB-->>AI: Dados de comportamento
        AI->>AI: Gera desafio personalizado
        AI-->>GAMIF: Desafio: "Leia 5 artigos de IA"
        
        GAMIF->>DB: Cria desafio para usuário
        GAMIF->>WS: Notifica novo desafio
        WS->>C: Notificação de desafio
        C-->>U: "Novo desafio semanal disponível"
        
        U->>C: Aceita desafio
        C->>API: POST /challenges/{id}/accept
        API->>DB: Registra participação no desafio
        
        loop Durante a semana
            U->>C: Lê artigo de IA
            C->>API: Tracking de progresso
            API->>GAMIF: Progresso do desafio
            GAMIF->>DB: Atualiza progresso (2/5)
            GAMIF->>WS: Atualização em tempo real
            WS->>C: Progresso atualizado
            C-->>U: "Progresso: 2/5 artigos"
        end
        
        alt Desafio completado
            GAMIF->>DB: Marca desafio como completo
            GAMIF->>DB: Adiciona recompensa especial
            GAMIF->>WS: Conquista de desafio
            WS->>C: Celebração de conclusão
            C-->>U: "Desafio completo! +1000 pontos"
        end
    end

    %% Sistema de níveis
    rect rgb(248, 240, 255)
        Note over U,AI: 5. PROGRESSÃO DE NÍVEIS
        Note over GAMIF: Usuário acumula pontos suficientes
        GAMIF->>DB: Calcula nível atual vs pontos
        
        alt Level up detectado
            GAMIF->>DB: Atualiza nível do usuário
            GAMIF->>DB: Desbloqueia privilégios do nível
            GAMIF->>WS: Evento de level up
            WS->>C: Animação especial de level up
            C->>C: Mostra novos privilégios desbloqueados
            C-->>U: "Level 5 alcançado! Novos recursos"
        end
        
        U->>C: Visualiza perfil
        C->>API: GET /users/me/achievements
        API->>DB: Busca conquistas + estatísticas
        DB-->>API: Perfil completo de gamificação
        API-->>C: Dados de progresso
        C-->>U: Dashboard com badges, nível, pontos
    end
```

**Funcionalidades:**
- Sistema de pontos por ações
- Conquistas automáticas
- Streaks de atividade
- Rankings competitivos
- Desafios personalizados com IA
- Progressão por níveis

---

## 8. Grupos de Estudo e Mentoria

Sistema completo de colaboração educacional com grupos, sessões ao vivo e mentoria 1-on-1.

```mermaid
sequenceDiagram
    participant U1 as Estudante
    participant C1 as Cliente 1
    participant U2 as Mentor
    participant C2 as Cliente 2
    participant API as API Gateway
    participant DB as PostgreSQL
    participant WS as WebSocket
    participant VIDEO as Video Service
    participant NOTIF as Notification Service

    Note over U1,NOTIF: Fluxos de Grupos de Estudo e Mentoria

    %% Criação de grupo de estudo
    rect rgb(240, 248, 255)
        Note over U1,NOTIF: 1. CRIAÇÃO DE GRUPO DE ESTUDO
        U1->>C1: Cria novo grupo "Python para Iniciantes"
        C1->>API: POST /study-groups
        API->>DB: Cria grupo + adiciona criador como owner
        DB-->>API: Grupo criado com ID
        API->>WS: Notifica criação do grupo
        API-->>C1: Grupo criado com sucesso
        C1-->>U1: "Grupo criado! Compartilhe o link"
    end

    %% Outros usuários se juntam ao grupo
    rect rgb(240, 255, 240)
        Note over U1,NOTIF: 2. USUÁRIOS SE JUNTAM AO GRUPO
        participant U3 as Outro Estudante
        participant C3 as Cliente 3
        
        U3->>C3: Encontra grupo na busca
        C3->>API: GET /study-groups/search
        API->>DB: Busca grupos públicos
        DB-->>API: Lista de grupos disponíveis
        API-->>C3: Grupos encontrados
        
        U3->>C3: Clica "Entrar no grupo"
        C3->>API: POST /study-groups/{id}/join
        API->>DB: Verifica se grupo não está cheio
        alt Grupo tem vagas
            API->>DB: Adiciona membro ao grupo
            API->>WS: Notifica novo membro
            WS->>C1: Notificação para owner
            C1-->>U1: "Novo membro se juntou ao grupo"
            API-->>C3: Entrou no grupo com sucesso
            C3-->>U3: "Você entrou no grupo Python para Iniciantes"
        else Grupo cheio
            API-->>C3: Erro - grupo lotado
            C3-->>U3: "Grupo está cheio (lista de espera?)"
        end
    end

    %% Sessão de estudo ao vivo
    rect rgb(255, 248, 240)
        Note over U1,NOTIF: 3. SESSÃO DE ESTUDO AO VIVO
        U1->>C1: Agenda sessão de estudo
        C1->>API: POST /study-groups/{id}/sessions
        API->>DB: Cria sessão agendada
        API->>WS: Notifica membros do grupo
        
        loop Para cada membro do grupo
            WS->>NOTIF: Cria notificação de sessão
            NOTIF->>DB: Salva notificação
            WS->>C3: Notificação em tempo real
            C3-->>U3: "Sessão de Python agendada para amanhã"
        end
        
        Note over U1,U3: No horário da sessão
        U1->>C1: Inicia sessão ao vivo
        C1->>API: POST /study-groups/{id}/sessions/{sessionId}/start
        API->>VIDEO: Cria sala de vídeo conferência
        VIDEO-->>API: Link da sala criado
        API->>WS: Sessão iniciada
        
        loop Membros se juntam
            WS->>C3: Notificação "Sessão iniciou"
            U3->>C3: Clica "Entrar na sessão"
            C3->>VIDEO: Conecta à sala de vídeo
            VIDEO-->>C3: Stream de vídeo/áudio
        end
    end

    %% Solicitação de mentoria
    rect rgb(255, 240, 255)
        Note over U1,NOTIF: 4. SISTEMA DE MENTORIA
        U1->>C1: Busca mentor em Machine Learning
        C1->>API: GET /mentors?subject=machine-learning
        API->>DB: Busca mentores disponíveis
        DB-->>API: Lista de mentores qualificados
        API-->>C1: Mentores com ratings e especialidades
        
        U1->>C1: Solicita mentoria com Usuário 2
        C1->>API: POST /mentorships
        API->>DB: Cria solicitação de mentoria
        API->>WS: Notifica mentor
        WS->>C2: Nova solicitação de mentoria
        C2-->>U2: "Nova solicitação: ML para iniciante"
        
        U2->>C2: Aceita solicitação
        C2->>API: PUT /mentorships/{id} (status: active)
        API->>DB: Atualiza status da mentoria
        API->>WS: Mentoria aceita
        WS->>C1: Notificação de aceitação
        C1-->>U1: "Sua mentoria foi aceita!"
    end

    %% Sessão de mentoria individual
    rect rgb(248, 240, 255)
        Note over U1,NOTIF: 5. SESSÃO DE MENTORIA 1-ON-1
        U1->>C1: Agenda sessão com mentor
        C1->>API: POST /mentorships/{id}/sessions
        API->>DB: Cria sessão de mentoria
        API->>WS: Notifica mentor
        WS->>C2: Nova sessão agendada
        C2-->>U2: "Sessão de mentoria agendada"
        
        Note over U1,U2: No horário agendado
        U2->>C2: Inicia sessão de mentoria
        C2->>API: POST /mentorships/{id}/sessions/{sessionId}/start
        API->>VIDEO: Cria sala privada de mentoria
        VIDEO-->>API: Sala criada
        API->>WS: Sessão iniciada
        WS->>C1: Mentor está disponível
        
        U1->>C1: Entra na sessão
        C1->>VIDEO: Conecta à sala privada
        VIDEO-->>C1: Video call 1-on-1 estabelecida
        
        Note over U1,U2: Durante a sessão
        U2->>C2: Compartilha tela para mostrar código
        C2->>VIDEO: Screen sharing ativado
        VIDEO->>C1: Tela do mentor exibida
        C1-->>U1: Visualiza código do mentor
        
        Note over U1,U2: Fim da sessão
        U2->>C2: Finaliza sessão
        C2->>API: POST /mentorships/{id}/sessions/{sessionId}/end
        API->>DB: Registra duração e feedback
        API->>WS: Sessão finalizada
        WS->>C1: Solicitação de avaliação
        C1-->>U1: "Avalie sua sessão de mentoria"
        
        U1->>C1: Dá 5 estrelas e feedback
        C1->>API: POST /mentorships/{id}/rating
        API->>DB: Salva avaliação
        API->>WS: Avaliação recebida
        WS->>C2: Feedback positivo recebido
        C2-->>U2: "Você recebeu 5 estrelas!"
    end
```

**Funcionalidades:**
- Grupos de estudo públicos e privados
- Sessões de vídeo ao vivo
- Sistema de matching mentor-mentee
- Video calls 1-on-1 com screen sharing
- Sistema de avaliação e rating
- Notificações automáticas para sessões

---

## 🎯 Resumo dos Componentes

### **Tecnologias Principais**
- **Frontend**: Next.js 14, TypeScript, PWA
- **Backend**: Node.js, Fastify, Microserviços
- **Bancos**: PostgreSQL, Redis, Elasticsearch, Pinecone
- **IA**: OpenAI GPT-4, Machine Learning
- **Real-time**: WebSocket, Push Notifications
- **Infraestrutura**: Kubernetes, AWS, Docker

### **Funcionalidades Chave**
- Sistema completo de autenticação e autorização
- Feed personalizado com algoritmo de ML
- Busca híbrida (textual + semântica)
- Interações sociais em tempo real
- Gamificação com conquistas e rankings
- Grupos de estudo colaborativos
- Sistema de mentoria P2P
- Notificações multi-canal

### **Escalabilidade e Performance**
- Cache inteligente em múltiplas camadas
- Processamento assíncrono
- CDN para assets estáticos
- Load balancing automático
- Monitoramento e observabilidade

---

**Atualizado em**: Janeiro 2024  
**Versão**: 1.0.0 
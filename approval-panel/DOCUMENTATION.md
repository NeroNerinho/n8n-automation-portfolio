# Documentação Completa - Painel de Aprovação Hub de Automação

> **Desenvolvido por**: Phillipe (Nero) - Hub de Automação  
> **Versão**: 3.0 (Documentação Feynman)  
> **Última atualização**: Fevereiro 2026

---

## Índice

1. [Glossário Técnico (Explicação Feynman)](#glossário-técnico-explicação-feynman)
2. [Introdução para Iniciantes](#1-introdução-para-iniciantes)
3. [Visão Técnica do Sistema](#2-visão-técnica-do-sistema)
4. [Arquitetura de Segurança](#3-arquitetura-de-segurança)
5. [Integração com N8N](#4-integração-com-n8n)
6. [Estrutura de Componentes](#5-estrutura-de-componentes)
7. [Fluxos de Operação](#6-fluxos-de-operação)
8. [Guia de Manutenção](#7-guia-de-manutenção)
9. [Troubleshooting](#8-troubleshooting)

---

## Glossário Técnico (Explicação Feynman)

> 💡 **Técnica Feynman**: Se você não consegue explicar algo de forma simples, você não entende bem o suficiente.  
> — Richard Feynman, físico e Nobel

Esta seção explica cada termo técnico usado neste projeto através de **analogias do mundo real**, tornando a documentação acessível para qualquer pessoa.

---

### 🎫 JWT (JSON Web Token)

**Imagine Que...**

Você vai a um evento corporativo. Na portaria, mostra seu RG e a recepcionista verifica seus dados na lista. Ela te entrega um **crachá de visitante** com seu nome e setor autorizado. A partir daí, você não precisa mais mostrar o RG — basta exibir o crachá em cada porta.

| No Evento | No Sistema |
|-----------|------------|
| RG | Email + Senha |
| Recepcionista | Servidor n8n |
| Lista de convidados | Banco de dados |
| Crachá | Token JWT |
| Porta trancada | Página protegida |
| Informações no crachá | Dados do usuário (nome, role) |

**Por que isso importa?** O JWT permite que o servidor "confie" em você sem precisar consultar o banco de dados a cada clique.

---

### 🔐 RBAC (Role-Based Access Control)

**Imagine Que...**

Em um hospital, diferentes profissionais têm diferentes níveis de acesso:
- **Recepcionista**: Pode ver nomes e marcar consultas
- **Enfermeiro**: Pode ver prontuários e administrar medicações
- **Médico**: Pode prescrever tratamentos e fazer cirurgias
- **Diretor**: Pode acessar tudo, incluindo finanças

**No nosso sistema:**
| Role | Equivalente | Pode fazer |
|------|-------------|------------|
| `requester` | Fornecedor | Enviar materiais |
| `viewer` | Auditor | Ver histórico |
| `approver` | Aprovador | Aprovar/reprovar |
| `admin` | Diretor | Tudo + gerenciar usuários |

---

### 📡 Webhook

**Imagine Que...**

Você contrata um serviço de entrega que te liga no celular toda vez que um pacote chega. Você não precisa ficar verificando — eles avisam proativamente.

| Tradicional (Polling) | Webhook |
|-----------------------|---------|
| "Chegou pacote?" → "Não" | *silêncio* |
| "Chegou pacote?" → "Não" | *silêncio* |
| "Chegou pacote?" → "Sim!" | *telefone toca* "Chegou!" |
| Muitas perguntas desnecessárias | Só avisa quando acontece |

**No nosso sistema:** O frontend envia dados para o webhook do n8n, que processa e responde imediatamente.

---

### 🗄️ BigQuery

**Imagine Que...**

Você tem uma biblioteca com milhões de livros. A biblioteca comum teria fichas de papel para catalogar. Quando você quer achar todos os livros de ficção científica publicados em 1985, um funcionário levaria horas procurando nas fichas.

**BigQuery é como uma biblioteca com computador superinteligente:** você pergunta "quais livros de ficção científica de 1985?" e em segundos ele mostra todos os resultados — mesmo que sejam milhões de registros.

**Por que usamos:** Precisamos contar e filtrar milhares de checkings rapidamente. BigQuery faz isso em milissegundos.

---

### ⚛️ React e Componentes

**Imagine Que...**

Você está montando móveis IKEA. Em vez de construir uma estante do zero, você recebe peças modulares (gavetas, prateleiras, portas) que se encaixam de várias formas.

**React funciona assim:**
| IKEA | React |
|------|-------|
| Gaveta | `<Button />` |
| Prateleira | `<Card />` |
| Porta com espelho | `<Modal />` |
| Estante completa | `<Dashboard />` (composta de vários componentes) |

**Vantagem:** Se você quer mudar a cor de todos os botões, muda em um lugar só (o componente `Button`) e todos os botões do sistema mudam juntos.

---

### 🔄 TanStack Query (React Query)

**Imagine Que...**

Você liga no atendimento de uma empresa várias vezes por dia para perguntar "qual o status do meu pedido?". A atendente anota sua resposta num post-it e, nas próximas ligações, já responde na hora consultando o post-it — só verifica no sistema se passou muito tempo.

| Sem Cache | Com TanStack Query |
|-----------|-------------------|
| Cada clique → banco de dados | Primeira vez → banco de dados |
| Demora 500ms sempre | Próximas vezes → cache (5ms) |
| Servidor sobrecarregado | Servidor tranquilo |

**No nosso sistema:** Quando você abre o dashboard, os dados ficam em cache por 1 minuto. Navegar entre páginas é instantâneo.

---

### 🎨 Tailwind CSS

**Imagine Que...**

Você vai pintar uma casa, mas em vez de misturar tintas manualmente (CSS tradicional), você tem um catálogo enorme de cores prontas com códigos (`azul-500`, `verde-300`, `cinza-900`).

**Tradicional:**
```css
.botao { 
  background-color: #3b82f6; 
  padding: 8px 16px; 
  border-radius: 4px; 
}
```

**Tailwind:**
```html
<button class="bg-blue-500 px-4 py-2 rounded">Clique</button>
```

**Vantagem:** Todas as cores e espaçamentos são padronizados. Todo o sistema fica consistente sem esforço.

---

### 🌊 WebGL Shader

**Imagine Que...**

Na tela de login, você vê um fundo animado com ondas coloridas que se movem suavemente. Isso não é um vídeo — é um programa matemático calculando pixels em tempo real.

**Como funciona:**
1. Three.js cria uma "tela invisível" sobre a página
2. Um programa especial (shader) roda na placa de vídeo
3. Para cada pixel, o shader calcula: "dado o tempo atual e minha posição, qual cor exibir?"
4. Resultado: animação fluida sem consumir muito processador

**Por que usamos:** Cria uma experiência premium sem precisar carregar vídeos pesados.

---

### 📤 Axios Interceptor

**Imagine Que...**

Você contrata um secretário que, antes de enviar qualquer carta sua, automaticamente:
1. Adiciona seu papel timbrado
2. Coloca seu carimbo de assinatura
3. Se a resposta vier "não conheço você", te avisa imediatamente

**No código:**
- **Request Interceptor:** Antes de cada requisição, adiciona o token JWT automaticamente
- **Response Interceptor:** Se receber "não autorizado" (401), desloga o usuário automaticamente

**Vantagem:** Você não precisa lembrar de adicionar o token em cada chamada — acontece sozinho.

---

## 1. Introdução para Iniciantes

### O que é este sistema?

Imagine uma fábrica de materiais de propaganda. Todos os dias, fornecedores enviam fotos e vídeos de anúncios para aprovação. Este sistema é como um "porteiro digital" que:

1. **Recebe** todos os materiais de fornecedores
2. **Organiza** em filas de aprovação
3. **Permite** que aprovadores vejam e decidam (aprovar/reprovar)
4. **Notifica** os fornecedores sobre as decisões

### Por que precisamos disso?

Antes deste sistema, todo o processo era feito por email:
- ❌ Materiais se perdiam
- ❌ Não tinha controle de quem aprovou
- ❌ Difícil saber o status de cada material

Agora com o sistema:
- ✅ Tudo centralizado em um lugar
- ✅ Histórico completo de decisões
- ✅ Notificações automáticas
- ✅ Estatísticas em tempo real

### Como acessar?

1. Abra o navegador (Chrome, Firefox, Edge)
2. Acesse: `http://localhost:8080` (desenvolvimento) ou a URL de produção
3. Digite seu email e senha
4. Pronto! Você está no painel

### Navegação Básica

| Ícone | Página | O que faz |
|-------|--------|-----------|
| 📊 | Painel | Mostra estatísticas gerais |
| ✓ | Aprovações | Lista de materiais para aprovar |
| 👥 | Clientes | Gerenciamento de clientes |
| 📈 | Relatórios | Exportar dados para Excel/PDF |
| ⚙️ | Configurações | Ajustes do sistema |

---

## 2. Visão Técnica do Sistema

### Stack Tecnológica

```
Frontend (Este Projeto)
├── React 19          → Framework de interface
├── TypeScript        → Tipagem estática
├── TailwindCSS 4     → Estilização
├── Radix UI          → Componentes acessíveis
├── TanStack Query    → Gerenciamento de estado async
├── Axios             → Requisições HTTP
├── Recharts          → Gráficos
├── Three.js          → Animações WebGL
└── Webpack           → Bundler

Backend (N8N)
├── Webhook           → Recebe requisições do frontend
├── BigQuery          → Banco de dados
├── Google Drive      → Armazenamento de arquivos
└── SMTP              → Envio de emails
```

### Diagrama de Arquitetura

```
┌────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO (Browser)                          │
└────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + TypeScript)                  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Login.tsx  │  │ Dashboard.tsx│  │ Approvals.tsx│              │
│  │              │  │              │  │              │              │
│  │ - Autent.    │  │ - Stats      │  │ - Lista      │              │
│  │ - Shader BG  │  │ - Cards      │  │ - Aprovar    │              │
│  │ - Stats      │  │ - Gráficos   │  │ - Reprovar   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                           │                                        │
│  ┌────────────────────────┴────────────────────────────────────┐   │
│  │                      AuthContext                            │   │
│  │  - Gerencia sessão do usuário                               │   │
│  │  - Armazena token JWT                                       │   │
│  │  - Controla acesso às rotas                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                        │
│  ┌────────────────────────┴────────────────────────────────────┐   │
│  │                      Axios Client                           │   │
│  │  - Interceptors para JWT                                    │   │
│  │  - Redirect automático se 401                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS (POST)
                                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                      N8N WEBHOOK SERVER                            │
│                https://n8n.automation-api.com/webhook/             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Router de Ações                          │  │
│  │                                                              │  │
│  │  action: "login"       → Valida credenciais                  │  │
│  │  action: "get_stats"   → Retorna estatísticas                │  │
│  │  action: "get_pending" → Lista checkings pendentes           │  │
│  │  action: "approve"     → Marca como aprovado                 │  │
│  │  action: "reject"      → Marca como reprovado + email        │  │
│  │  action: "health_check"→ Status dos serviços                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                        │
│                           ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │      Google Cloud Services                                   │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                │  │
│  │  │  BigQuery  │ │   Drive    │ │    SMTP    │                │  │
│  │  │  (Dados)   │ │  (PDFs)    │ │  (Emails)  │                │  │
│  │  └────────────┘ └────────────┘ └────────────┘                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios

```
src/
├── App.tsx                 # Definição de rotas
├── main.tsx                # Entry point
├── index.css               # Estilos globais
│
├── components/             # Componentes compartilhados
│   ├── GlobalSearch.tsx    # Busca global (conectada ao n8n)
│   ├── LiveSystemStatus.tsx# Monitor de saúde
│   ├── ProtectedRoute.tsx  # Proteção de rotas
│   ├── UserMenu.tsx        # Menu do usuário
│   └── ui/                 # Componentes base (shadcn)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── webgl-shader.tsx        # Shader do login
│       ├── colorful-wave-pattern-1.tsx  # Shader do dashboard
│       └── ...
│
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticação
│
├── features/               # Módulos de funcionalidade
│   ├── approvals/          # Funcionalidade de aprovações
│   │   ├── hooks/
│   │   │   ├── usePending.ts   # Hook para buscar pendentes
│   │   │   └── useMutations.ts # Hooks de aprovar/reprovar
│   │   └── types.ts            # Tipos TypeScript
│   └── dashboard/          # Funcionalidade do dashboard
│       ├── api.ts          # API de estatísticas
│       └── components/
│           ├── StatsGrid.tsx   # Grid de estatísticas
│           └── RecentLogs.tsx  # Logs recentes
│
├── layouts/
│   ├── AppShell.tsx        # Layout principal
│   └── Sidebar.tsx         # Barra lateral
│
├── lib/
│   ├── axios.ts            # Configuração do cliente HTTP
│   ├── exportUtils.ts      # Funções de exportação
│   └── utils.ts            # Utilitários gerais
│
└── pages/                  # Páginas da aplicação
    ├── Login.tsx           # Página de login
    ├── Dashboard.tsx       # Página inicial
    ├── Approvals.tsx       # Página de aprovações
    ├── Reports.tsx         # Página de relatórios
    └── Settings.tsx        # Configurações
```

---

## 3. Arquitetura de Segurança

### Camadas de Proteção

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CAMADA DE TRANSPORTE                                         │
│    └─ HTTPS (TLS 1.3) - Criptografia de dados em trânsito       │
├─────────────────────────────────────────────────────────────────┤
│ 2. CAMADA DE AUTENTICAÇÃO                                       │
│    ├─ Login com email/senha                                     │
│    ├─ Token JWT armazenado em localStorage                      │
│    └─ Validação de sessão a cada requisição                     │
├─────────────────────────────────────────────────────────────────┤
│ 3. CAMADA DE AUTORIZAÇÃO                                        │
│    ├─ ProtectedRoute verifica se usuário está logado            │
│    ├─ Roles: admin, approver, viewer                            │
│    └─ Axios interceptor adiciona Bearer token                   │
├─────────────────────────────────────────────────────────────────┤
│ 4. CAMADA DE RESPOSTA                                           │
│    ├─ HTTP 401 → Limpa sessão e redireciona para login          │
│    └─ Tratamento centralizado de erros                          │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação

```
Usuário         Frontend           N8N            BigQuery
   │                │               │                │
   │─── Email/Senha ──►│            │                │
   │                │── POST login ──►│              │
   │                │               │ Query user ──► │
   │                │               │◄── Resultado ──│
   │                │◄── JWT Token ──│               │
   │◄── Logado ─────│               │                │
   │                │               │                │
   │ (Cada request) │               │                │
   │                │── + Bearer ───►│               │
   │                │◄── Dados ─────│                │
```

### Detalhes do AuthContext

**Arquivo**: `src/contexts/AuthContext.tsx`

```typescript
/**
 * AuthContext gerencia toda a autenticação do sistema.
 * 
 * RESPONSABILIDADES:
 * 1. Manter estado do usuário logado
 * 2. Gerenciar token JWT
 * 3. Persistir sessão no localStorage
 * 4. Expor funções de login/logout
 * 
 * FLUXO DE LOGIN:
 * 1. Usuário chama login(email, password)
 * 2. AuthContext faz POST para n8n com action: 'login'
 * 3. Se sucesso, armazena token e user no state e localStorage
 * 4. Componentes que usam useAuth() recebem isAuthenticated: true
 * 
 * FLUXO DE LOGOUT:
 * 1. Usuário clama logout()
 * 2. AuthContext limpa state e localStorage
 * 3. Axios interceptor redireciona para /login
 */
```

### Axios Interceptors

**Arquivo**: `src/lib/axios.ts`

```typescript
/**
 * Configuração centralizada do cliente HTTP.
 * 
 * REQUEST INTERCEPTOR:
 * - Antes de cada requisição, adiciona header Authorization
 * - Authorization: Bearer <token>
 * 
 * RESPONSE INTERCEPTOR:
 * - Se receber 401 (Unauthorized), limpa sessão
 * - Redireciona automaticamente para /login
 * 
 * SEGURANÇA:
 * - Não expõe credenciais no código
 * - Token vem do localStorage (encriptado pelo browser)
 * - URL base vem de variável de ambiente
 */
```

---

## 4. Integração com N8N

### Configuração do Webhook

**URL Base**: `https://n8n.automation-api.com/webhook/painel-aprovacao`

**Método**: POST (todas as actions)

**Headers Necessários**:
```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Actions Disponíveis

#### `login` - Autenticação

```javascript
// REQUEST
{
    "action": "login",
    "email": "usuario@automation-api.com",
    "password": "senha123"
}

// RESPONSE (sucesso)
{
    "success": true,
    "user": {
        "name": "Nome do Usuário",
        "email": "usuario@automation-api.com",
        "role": "approver"
    }
}

// RESPONSE (erro)
{
    "success": false,
    "error": "Credenciais inválidas"
}
```

#### `get_stats` - Estatísticas

```javascript
// REQUEST
{
    "action": "get_stats"
}

// RESPONSE
{
    "stats": {
        "total": 1248,
        "pending": 12,
        "approved": 980,
        "rejected": 256
    }
}
```

#### `get_pending` - Listar Pendentes

```javascript
// REQUEST
{
    "action": "get_pending"
}

// RESPONSE
{
    "checkings": [
        {
            "id": "2026-02-04T10:30:00.000Z",
            "n_pi": "PI-12345",
            "cliente": "Cliente ABC",
            "veiculo": "TV Globo",
            "fornecedor": "Fornecedor XYZ",
            "email": "fornecedor@email.com",
            "webViewLink": "https://drive.google.com/...",
            "totalArquivos": 5,
            "approval_status": "PENDENTE",
            "rejection_count": 0,
            "data_envio": "04/02/2026 10:30"
        }
    ]
}
```

#### `approve` - Aprovar Checking

```javascript
// REQUEST
{
    "action": "approve",
    "id": "2026-02-04T10:30:00.000Z",
    "approval_user": "aprovador@automation-api.com"
}

// RESPONSE
{
    "success": true,
    "message": "Checking aprovado com sucesso"
}
```

#### `reject` - Reprovar Checking

```javascript
// REQUEST (multipart/form-data se tiver PDF)
{
    "action": "reject",
    "id": "2026-02-04T10:30:00.000Z",
    "reason": "Imagem fora de foco",
    "approval_user": "aprovador@automation-api.com",
    "pdf_file": <arquivo PDF opcional>
}

// RESPONSE
{
    "success": true,
    "message": "Checking reprovado e fornecedor notificado"
}
```

#### `health_check` - Status do Sistema

```javascript
// REQUEST
{
    "action": "health_check"
}

// RESPONSE
{
    "status": "online",
    "timestamp": "2026-02-04T12:00:00-03:00",
    "services": {
        "bigquery": "connected",
        "drive": "connected",
        "smtp": "connected"
    }
}
```

### Workflow N8N Completo

**Arquivo de referência**: `n8n_workflow_updated.json`

O workflow processa as requisições assim:

```
Webhook POST
    │
    ▼
Parse Request (extrai action do body)
    │
    ▼
Router de Ações (Switch node)
    │
    ├─► get_stats    → BigQuery Query → Respond
    ├─► get_pending  → BigQuery Query → Format → Respond
    ├─► approve      → BigQuery UPDATE → Respond
    ├─► reject       → Get Data → Create Folder → Upload Files 
    │                   → BigQuery UPDATE → Send Email → Respond
    ├─► login        → Validate Credentials → Respond
    └─► health_check → Check Services → Respond
```

---

## 5. Estrutura de Componentes

### Componentes UI Base (shadcn)

Todos seguem o padrão:

```typescript
// Padrão de componente shadcn/ui
import * as React from "react"
import { cn } from "@/lib/utils"

const Component = React.forwardRef<HTMLElement, Props>(
    ({ className, ...props }, ref) => (
        <element
            ref={ref}
            className={cn("classes-base", className)}
            {...props}
        />
    )
)
Component.displayName = "Component"

export { Component }
```

### GlobalSearch

**Arquivo**: `src/components/GlobalSearch.tsx`

**Descrição**: Barra de busca global que pesquisa em todos os checkings.

**Funcionamento**:
1. Usuário digita no campo de busca
2. Após 300ms (debounce), busca é executada
3. Filtra checkings por: cliente, n_pi, veiculo, fornecedor
4. Mostra dropdown com até 8 resultados
5. Clique navega para a aprovação específica

**Dependências**:
- TanStack Query para cache de 1 minuto
- Axios para requisição ao n8n
- useState/useEffect/useMemo para lógica

### StatCard

**Arquivo**: `src/components/ui/stat-card.tsx`

**Descrição**: Card de estatística com ícone e gradiente.

**Props**:
- `title`: Título do card
- `value`: Valor numérico
- `description`: Texto descritivo
- `icon`: Componente Lucide
- `gradient`: "blue" | "amber" | "green" | "red"

### WebGLShader

**Arquivo**: `src/components/ui/webgl-shader.tsx`

**Descrição**: Animação de fundo da página de login usando Three.js.

**Como funciona**:
1. Cria canvas fullscreen
2. Inicializa cena Three.js com shader GLSL
3. Shader gera padrão de ondas RGB
4. Animação roda a 60fps

### ElectricWavesShader

**Arquivo**: `src/components/ui/colorful-wave-pattern-1.tsx`

**Descrição**: Animação de fundo do dashboard com controles interativos.

**Controles disponíveis**:
- Contagem de ondas (1-20)
- Amplitude (0.01-0.5)
- Frequência (0.5-10)
- Brilho (0.00001-0.01)
- Separação de cor (0-0.5)

---

## 6. Fluxos de Operação

### Fluxo de Aprovação

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. FORNECEDOR ENVIA MATERIAL                                     │
│    └─ Sistema externo envia para BigQuery                        │
├──────────────────────────────────────────────────────────────────┤
│ 2. APROVADOR ACESSA O PAINEL                                     │
│    ├─ Login com email/senha                                      │
│    ├─ Dashboard mostra estatísticas                              │
│    └─ Navega para "Aprovações"                                   │
├──────────────────────────────────────────────────────────────────┤
│ 3. APROVADOR VÊ LISTA DE PENDENTES                               │
│    ├─ Cards com informações do checking                          │
│    ├─ Link para Google Drive (arquivos)                          │
│    └─ Botões Aprovar/Reprovar                                    │
├──────────────────────────────────────────────────────────────────┤
│ 4A. APROVAR                                                      │
│    ├─ Clica em "Aprovar"                                         │
│    ├─ Sistema atualiza BigQuery (APROVADO)                       │
│    └─ Card some da lista                                         │
├──────────────────────────────────────────────────────────────────┤
│ 4B. REPROVAR                                                     │
│    ├─ Clica em "Reprovar"                                        │
│    ├─ Modal abre pedindo motivo                                  │
│    ├─ Opcionalmente anexa PDF                                    │
│    ├─ Confirma reprovação                                        │
│    ├─ Sistema atualiza BigQuery (REPROVADO)                      │
│    ├─ Cria pasta "Histórico" no Drive                            │
│    ├─ Upload do PDF se fornecido                                 │
│    ├─ Envia email para fornecedor                                │
│    └─ Card some da lista                                         │
└──────────────────────────────────────────────────────────────────┘
```

### Fluxo de Busca Global

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO DIGITA NA BUSCA                                       │
│    └─ "Coca"                                                     │
├──────────────────────────────────────────────────────────────────┤
│ 2. DEBOUNCE DE 300MS                                             │
│    └─ Evita muitas requisições enquanto digita                   │
├──────────────────────────────────────────────────────────────────┤
│ 3. BUSCA EXECUTA                                                 │
│    ├─ Usa dados em cache (TanStack Query)                        │
│    ├─ Se cache expirou, busca do n8n                             │
│    └─ Filtra por: cliente, PI, veículo, fornecedor               │
├──────────────────────────────────────────────────────────────────┤
│ 4. DROPDOWN MOSTRA RESULTADOS                                    │
│    ├─ Até 8 resultados                                           │
│    ├─ Cada resultado mostra cliente + PI + status                │
│    └─ Cores indicam: pendente (amarelo), aprovado (verde)        │
├──────────────────────────────────────────────────────────────────┤
│ 5. USUÁRIO CLICA EM RESULTADO                                    │
│    └─ Navega para /approvals?pi=XXXXX                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Guia de Manutenção

### Adicionar Nova Action no N8N

1. **No N8N**: Abrir workflow `painel-aprovacao`
2. Adicionar nova branch no "Router de Ações"
3. Criar nodes de processamento
4. Adicionar "Respond to Webhook" ao final

5. **No Frontend**: Criar hook em `src/features/*/hooks/`

```typescript
// Exemplo: nova action "get_clients"
export const fetchClients = async () => {
    const { data } = await api.post('', { action: 'get_clients' })
    return data.clients || []
}

export function useClients() {
    return useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients
    })
}
```

### Adicionar Nova Página

1. Criar arquivo em `src/pages/NovaPagina.tsx`
2. Adicionar rota em `src/App.tsx`
3. Adicionar item no menu em `src/layouts/Sidebar.tsx`

```typescript
// App.tsx
<Route path="/nova-pagina" element={<NovaPagina />} />

// Sidebar.tsx
{
    name: "Nova Página",
    href: "/nova-pagina",
    icon: IconName,
}
```

### Estilização Padrão

Usar classes glassmorphism consistentes:

```css
/* Card padrão */
bg-black/40 backdrop-blur-xl border-white/10 rounded-xl

/* Input padrão */
bg-black/40 backdrop-blur-md border border-white/10 
text-white placeholder:text-zinc-500

/* Botão primário */
bg-white text-black hover:bg-zinc-200

/* Botão outline */
bg-white/5 border-white/10 text-white hover:bg-white/10
```

---

## 8. Troubleshooting

### Problema: Erro de CORS

**Sintoma**: Console mostra "Access-Control-Allow-Origin"

**Solução**:
1. Verificar se workflow N8N está ativo
2. Confirmar headers CORS no webhook
3. Testar com curl para isolar problema

```bash
curl -X POST https://n8n.automation-api.com/webhook/painel-aprovacao \
  -H "Content-Type: application/json" \
  -d '{"action": "health_check"}'
```

### Problema: Login não funciona

**Sintoma**: Tela de login trava ou mostra erro

**Passos de debug**:
1. Abrir DevTools (F12) → Console
2. Verificar se há erros de rede
3. Confirmar URL no `.env`
4. Testar credenciais diretamente no N8N

### Problema: Animação travada

**Sintoma**: Shader do dashboard não aparece

**Solução**:
1. Verificar se WebGL está habilitado no browser
2. Atualizar drivers de vídeo
3. Testar em outro navegador

### Problema: Dados não atualizam

**Sintoma**: Lista de pendentes não muda

**Solução**:
1. Forçar refresh: Ctrl+Shift+R
2. Limpar cache do TanStack Query
3. Verificar conexão com N8N

```javascript
// No console do browser
localStorage.clear()
location.reload()
```

---

## Apêndice: Comandos Úteis

```bash
# Iniciar desenvolvimento
npm start

# Build produção
npm run build

# Verificar erros de lint
npm run lint

# Limpar node_modules e reinstalar
rm -rf node_modules && npm install
```

---

© 2026 Hub de Automação - Desenvolvido por Phillipe (Nero)

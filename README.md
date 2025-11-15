# 🚀 REST API Boilerplate

Boilerplate completo de API REST com autenticação, validação e documentação automatizada. Pronto para produção e fácil de estender.

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** - Sistema completo de registro e login
- ✅ **Validação com Zod** - Validação de dados robusta e type-safe
- 📝 **Swagger Docs** - Documentação interativa da API
- 🧪 **Testes Automatizados** - Suíte de testes com Jest
- 🐳 **Docker Ready** - Containerização completa com Docker Compose
- 📊 **Logging Estruturado** - Logs profissionais com Pino
- 🔒 **Segurança** - Helmet, CORS, Rate Limiting
- 🎨 **Frontend Demo** - Interface web de exemplo
- 📦 **TypeScript** - Type safety em todo o código
- 🗄️ **Prisma ORM** - Migrations e queries type-safe

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Superset tipado do JavaScript
- **Prisma** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional

### Segurança & Validação
- **JWT** - JSON Web Tokens para autenticação
- **Bcrypt** - Hash de senhas seguro
- **Zod** - Validação de schemas TypeScript-first
- **Helmet** - Segurança de headers HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Proteção contra abuso

### Testes & Qualidade
- **Jest** - Framework de testes
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatação de código

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (opcional)

## 🚀 Início Rápido

### Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd rest-api-boilerplate
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

4. **Configure o banco de dados**
```bash
# Gera o Prisma Client
npm run prisma:generate

# Executa as migrations
npm run prisma:migrate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

### Usando Docker Compose

```bash
# Inicia todos os serviços (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Visualiza os logs
docker-compose logs -f

# Para os serviços
docker-compose down
```

## 📚 Documentação da API

### Swagger UI
Acesse a documentação interativa em: `http://localhost:3000/api-docs`

### Endpoints Principais

#### Autenticação

**POST** `/api/v1/auth/register`
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**POST** `/api/v1/auth/login`
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**GET** `/api/v1/auth/me`
Headers: `Authorization: Bearer <token>`

#### Usuários

**GET** `/api/v1/users` - Lista todos os usuários (autenticado)
**GET** `/api/v1/users/:id` - Busca usuário por ID (autenticado)
**PUT** `/api/v1/users/:id` - Atualiza usuário (autenticado)
**DELETE** `/api/v1/users/:id` - Remove usuário (admin)

#### Posts

**GET** `/api/v1/posts` - Lista todos os posts (público)
**GET** `/api/v1/posts/:id` - Busca post por ID (público)
**POST** `/api/v1/posts` - Cria novo post (autenticado)
**PUT** `/api/v1/posts/:id` - Atualiza post (autor ou admin)
**DELETE** `/api/v1/posts/:id` - Remove post (autor ou admin)

## 🧪 Testes

```bash
# Executa todos os testes
npm test

# Executa testes em modo watch
npm run test:watch

# Gera relatório de cobertura
npm run test:coverage
```

## 🏗️ Estrutura do Projeto

```
rest-api-boilerplate/
├── src/
│   ├── config/          # Configurações (DB, Swagger, ENV)
│   ├── controllers/     # Controladores das rotas
│   ├── middlewares/     # Middlewares (Auth, Validation, Error)
│   ├── routes/          # Definição das rotas
│   ├── schemas/         # Schemas de validação Zod
│   ├── utils/           # Utilitários (JWT, Password, Logger)
│   ├── __tests__/       # Testes automatizados
│   ├── app.ts           # Configuração do Express
│   └── index.ts         # Entry point da aplicação
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
├── frontend/            # Frontend de demonstração
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── Dockerfile           # Dockerfile do backend
├── docker-compose.yml   # Orquestração de containers
├── nginx.conf           # Configuração do Nginx
└── package.json
```

## 🔒 Segurança

Este boilerplate implementa as seguintes medidas de segurança:

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Autenticação JWT com expiração configurável
- ✅ Headers de segurança com Helmet
- ✅ CORS configurável
- ✅ Rate limiting para prevenir abuso
- ✅ Validação de entrada com Zod
- ✅ SQL Injection protection via Prisma
- ✅ Logs estruturados para auditoria

## 🌱 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta do servidor | `3000` |
| `API_VERSION` | Versão da API | `v1` |
| `DATABASE_URL` | URL de conexão do PostgreSQL | - |
| `JWT_SECRET` | Chave secreta do JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `CORS_ORIGIN` | Origem permitida para CORS | `http://localhost:3001` |
| `RATE_LIMIT_WINDOW_MS` | Janela de rate limiting (ms) | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requisições por janela | `100` |

## 📦 Scripts Disponíveis

```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Compila TypeScript para JavaScript
npm start                # Inicia servidor de produção
npm test                 # Executa testes
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Gera relatório de cobertura
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre Prisma Studio
npm run lint             # Executa ESLint
npm run format           # Formata código com Prettier
```

## 🐳 Docker

### Construir e executar

```bash
# Build da imagem
docker build -t rest-api-boilerplate .

# Executar container
docker run -p 3000:3000 --env-file .env rest-api-boilerplate
```

### Docker Compose

O projeto inclui um `docker-compose.yml` com:
- PostgreSQL (porta 5432)
- Backend API (porta 3000)
- Frontend Nginx (porta 3001)

```bash
docker-compose up -d
```

## 🎨 Frontend Demo

Um frontend simples está incluído em `/frontend` para demonstração da API:

- Interface de registro e login
- Gerenciamento de posts
- Consumo da API REST
- UI responsiva

Acesse em: `http://localhost:3001` (via Docker Compose)

## 🔄 Migrations do Banco de Dados

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Reset do banco (desenvolvimento)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio
```

## 📈 Monitoramento e Logs

Os logs são estruturados usando Pino e incluem:
- Timestamp ISO
- Nível de log (debug, info, warn, error)
- Contexto da requisição
- Queries do banco de dados (desenvolvimento)
- Erros com stack trace

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🙏 Agradecimentos

- Express.js pela simplicidade
- Prisma pela DX incrível
- Zod pela validação type-safe
- Comunidade Node.js

## 📞 Suporte

Para questões e suporte:
- Abra uma issue no GitHub
- Entre em contato: support@example.com

---

Desenvolvido com ❤️ usando TypeScript e Node.js
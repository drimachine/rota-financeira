# Rota Financeira

SaaS de planejamento financeiro para motoboys e entregadores de aplicativos
(iFood, Keeta e 99, com mais plataformas no futuro).

Responde a uma pergunta simples: **"Quanto eu realmente ganhei?"**

## Stack

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS (mobile-first, responsivo)
- **Backend:** Python + FastAPI — inclusive a autenticação: o frontend fala só com a
  API FastAPI (`/auth/signup`, `/auth/login`, `/auth/logout`), que por sua vez chama o
  Supabase Auth. Nenhuma chamada ao Supabase é feita diretamente do navegador.
- **Banco de dados / Auth:** Supabase (PostgreSQL + Auth + Row Level Security)

## Estrutura do projeto

```
rota-financeira/
├── frontend/          # App React (landing, login, cadastro, onboarding, dashboard...)
├── backend/           # API FastAPI (rotas de receitas, custos, metas, relatórios)
└── supabase/
    └── schema.sql     # Schema completo do banco com RLS
```

## Como rodar localmente

### 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, execute o conteúdo de `supabase/schema.sql`.
3. Em **Project Settings > API**, copie:
   - `Project URL`
   - `anon public key` (o backend usa para as chamadas de signup/login/logout)
   - `service_role key` (para o backend acessar os dados — **nunca exponha no frontend**)
   - `JWT Secret` (em **JWT Settings**, para o backend validar os tokens)
4. Em **Authentication > Sign In / Providers > Email**, confirme que o provedor de
   e-mail está **habilitado** (senão signup/login retornam 400 `email_provider_disabled`).

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Crie um arquivo `.env` em `backend/` com:

```
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_JWT_SECRET=seu-jwt-secret
FRONTEND_ORIGINS=http://localhost:5173
```

```bash
uvicorn app.main:app --reload --port 8000
```

A API sobe em `http://localhost:8000`. Documentação interativa em
`http://localhost:8000/docs`.

### 3. Frontend (React)

```bash
cd frontend
npm install
```

Crie um arquivo `.env` em `frontend/` com:

```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

O app sobe em `http://localhost:5173`.

## Telas incluídas

- Landing page (apresentação do produto, como funciona, FAQ)
- Login / Cadastro (via API FastAPI, que usa o Supabase Auth por trás)
- Onboarding (veículo, cidade, meta financeira)
- Dashboard (lucro líquido, receitas, custos, progresso da meta, mensagem motivacional)
- Nova receita / Novo custo
- Lista de receitas / Lista de custos
- Metas (criação e acompanhamento de progresso)
- Relatórios (evolução mensal com gráfico)
- Perfil (dados da conta, logout)

Navegação inferior fixa no mobile (Painel · Receitas · Custos · Metas · Perfil),
que vira uma barra lateral em telas maiores (responsivo).

## Identidade visual

- Fundo preto com leve tom roxo, cards em roxo profundo (`#4C1D95` → `#7C3AED`)
- Tipografia: Space Grotesk (títulos e números) + Inter (texto)
- Elemento de assinatura: uma linha de "rota" pontilhada, remetendo ao nome do
  produto e ao trajeto do entregador, usada como conector visual entre indicadores
  e como base da barra de progresso das metas

## Próximos passos sugeridos

- Adicionar Uber e outras plataformas de entrega/transporte
- Notificações push para lembrar de registrar receitas/custos do dia
- Exportação de relatórios em PDF
- Comparação de custos médios por cidade/veículo
- Testes automatizados (frontend e backend)

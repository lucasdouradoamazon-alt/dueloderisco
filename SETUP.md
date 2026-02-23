# 🚀 Guia de Configuração - Duelo de Risco

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta Google (para OAuth)

## Passo a Passo

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Aguarde a criação do projeto (pode levar alguns minutos)
3. Vá em **Project Settings > API**
4. Copie:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configurar Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Cole o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **Run**

### 3. Configurar Autenticação Google

1. Vá em **Authentication > Providers**
2. Encontre **Google** e habilite (toggle)
3. Configure no Google Cloud Console:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto ou use um existente
   - Vá em **APIs & Services > Credentials**
   - Clique em **Create Credentials > OAuth client ID**
   - Configure a tela de consentimento (se necessário)
   - Tipo: **Web application**
   - Authorized redirect URIs: `https://seu-projeto.supabase.co/auth/v1/callback`
   - Copie o **Client ID** e **Client Secret**
4. Volte no Supabase e cole as credenciais
5. Salve

### 4. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edite `.env.local` com suas credenciais:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

### 5. Rodar o Projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Ou fazer build
npm run build
```

Acesse: http://localhost:3000

## Deploy na Vercel

1. Push para GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente nas configurações do projeto
4. Deploy!

## Testando o Jogo

1. Abra o app em dois navegadores diferentes (ou modo anônimo)
2. Faça login com contas Google diferentes
3. Crie uma sala em um navegador
4. Copie o código e entre na sala no outro navegador
5. Inicie o torneio e divirta-se!

## Troubleshooting

### Erro: "supabaseUrl is required"
As variáveis de ambiente não estão configuradas. Verifique o arquivo `.env.local`.

### Erro de CORS no Google OAuth
Verifique se configurou corretamente os redirect URIs no Google Cloud Console.

### Realtime não funciona
No Supabase, vá em **Database > Replication** e habilite o Realtime para as tabelas.

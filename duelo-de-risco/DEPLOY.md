# 🚀 Deploy na Vercel - Passo a Passo

## Opção 1: Deploy via Interface Web (Recomendado)

### 1. Prepare o projeto
```bash
# Compacte a pasta do projeto (excluindo node_modules)
# No Windows: botão direito > Enviar para > Pasta compactada
# O arquivo será: duelo-de-risco.zip
```

### 2. Crie conta no Supabase
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Escolha um nome (ex: "duelo-de-risco")
4. Aguarde a criação (2-3 minutos)

### 3. Configure o banco de dados
1. No Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Abra o arquivo `supabase/schema.sql` do seu computador
4. Copie TODO o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **Run**
7. Pronto! ✅

### 4. Pegue as credenciais do Supabase
1. Vá em **Project Settings** (engrenagem no menu inferior)
2. Clique em **API**
3. Copie:
   - `URL` (https://chqiogcmqrrqzyfbvmei.supabase.co)
   - `anon public` eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocWlvZ2NtcXJycXp5ZmJ2bWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDQ4NzYsImV4cCI6MjA4NzM4MDg3Nn0.XnKARkWJN2KJG0_MvkPRgO8zICp3KZ0YnE3gFpgUHf8

### 5. Configure Google OAuth (Login)
1. Vá em **Authentication > Providers**
2. Encontre **Google** e habilite o toggle
3. Siga as instruções para criar credenciais no Google Cloud
4. Ou deixe para configurar depois (o app funciona sem login inicialmente para teste)

### 6. Deploy na Vercel
1. Acesse https://vercel.com
2. Crie conta (pode usar GitHub, Gmail, etc)
3. Clique em **Add New... > Project**
4. Escolha **Import Git Repository** ou faça upload do ZIP
5. Se fizer upload do ZIP:
   - Arraste o arquivo ZIP
   - Nome do projeto: "duelo-de-risco"
   - Framework Preset: Next.js
6. Clique em **Deploy**

### 7. Configure variáveis de ambiente
1. Após o deploy, vá em **Settings > Environment Variables**
2. Adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://sua-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sua-chave-aqui
   ```
3. Clique em **Save**
4. Vá em **Deployments**
5. Clique nos três pontos (...) do deploy atual
6. Clique em **Redeploy**

### 8. Pronto! 🎉
Seu app está no ar! O link será algo como:
`https://duelo-de-risco.vercel.app`

---

## Opção 2: Deploy via GitHub

### 1. Crie repositório no GitHub
1. Acesse https://github.com/new
2. Nome: "duelo-de-risco"
3. Deixe público
4. Crie o repositório

### 2. Suba o código
Se tiver git instalado:
```bash
cd duelo-de-risco
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/duelo-de-risco.git
git push -u origin main
```

Ou faça upload manual:
1. No GitHub, clique em "uploading an existing file"
2. Arraste todos os arquivos da pasta (exceto node_modules)
3. Commit

### 3. Conecte na Vercel
1. Acesse https://vercel.com/new
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente (igual Opção 1, passo 7)
4. Deploy!

---

## 🧪 Testando

1. Abra o link do deploy
2. Faça login com Google
3. Crie uma sala
4. Copie o código
5. Abra em outro navegador/incógnito
6. Entre com outra conta Google
7. Teste o jogo!

---

## ⚠️ Troubleshooting

### Erro "supabaseUrl is required"
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Certifique-se de que o projeto foi reimplantado (redeploy)

### Login não funciona
- Verifique se configurou o Google OAuth corretamente no Supabase
- Ou remova a obrigatoriedade de login para testes iniciais

### Realtime não atualiza
- No Supabase, vá em **Database > Replication**
- Certifique-se que as tabelas `rooms`, `participants` e `matches` estão habilitadas para realtime

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs na Vercel (Deployments > Functions)
2. Verifique o console do navegador (F12 > Console)
3. Confira se o schema SQL foi executado corretamente

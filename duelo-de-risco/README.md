# 🎮 Duelo de Risco

Jogo de blefe em grupo para jogar com amigos. Troque ou mantenha sua carta, blefe seu adversário e vença o torneio!

## 🚀 Como Funciona

1. **Crie uma sala** e compartilhe o código com seus amigos
2. **Entrem na sala** via link ou código de 6 caracteres
3. **Inicie o torneio** quando tiver número par de jogadores
4. **Disputem em duelos**: 
   - Jogador A vê sua carta (Vitória ou Derrota)
   - Decide manter ou oferecer troca
   - Jogador B tem 60s para aceitar ou recusar
   - Quem tiver "Vitória" avança no torneio

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Auth**: Google OAuth via Supabase Auth
- **Deploy**: Vercel

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/duelo-de-risco.git
cd duelo-de-risco

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Rode o servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em SQL Editor e execute o conteúdo de `supabase/schema.sql`
3. Em Authentication > Providers, habilite Google OAuth
4. Copie as credenciais para `.env.local`

## 🎯 Roadmap

- [x] MVP com mecânica de blefe
- [x] Sistema de torneio
- [x] Temporizador de 60 segundos
- [ ] Apostas com PIX
- [ ] Ranking global
- [ ] Histórico de partidas
- [ ] Modo espectador

## 📱 PWA

O app pode ser instalado no celular! Ao acessar pelo navegador, clique em "Adicionar à tela inicial".

## 📝 Licença

MIT

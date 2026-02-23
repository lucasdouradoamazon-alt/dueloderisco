-- Schema do Banco de Dados - Duelo de Risco
-- Execute no SQL Editor do Supabase

-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELAS
-- ============================================

-- Tabela de Usuários (extendida do Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  balance INTEGER DEFAULT 0, -- Em centavos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Salas
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- Código curto (ex: ABC123)
  name TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'bracket_ready', 'playing', 'finished')),
  max_players INTEGER DEFAULT 8,
  entry_fee INTEGER DEFAULT 0, -- Em centavos, 0 = sem aposta
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Participantes
CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  position INTEGER, -- Posição no bracket
  eliminated BOOLEAN DEFAULT FALSE,
  eliminated_at_round INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Tabela de Partidas/Disputas
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  position INTEGER NOT NULL,
  
  -- Jogador A
  player_a_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  player_a_card TEXT CHECK (player_a_card IN ('win', 'lose')),
  player_a_action TEXT CHECK (player_a_action IN ('keep', 'swap')),
  player_a_action_at TIMESTAMP WITH TIME ZONE,
  
  -- Jogador B
  player_b_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  player_b_decision TEXT CHECK (player_b_decision IN ('accept', 'reject')),
  player_b_decision_at TIMESTAMP WITH TIME ZONE,
  player_b_deadline TIMESTAMP WITH TIME ZONE,
  
  -- Resultado
  winner_id UUID REFERENCES public.users(id),
  
  -- Controle
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'player_a_turn', 'player_b_deciding', 'revealing', 'finished')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(room_id, round, position)
);

-- Tabela de Transações (para apostas futuro)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Em centavos
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'bet', 'prize', 'platform_fee')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  room_id UUID REFERENCES public.rooms(id),
  match_id UUID REFERENCES public.matches(id),
  pix_code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_rooms_code ON public.rooms(code);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_participants_room ON public.participants(room_id);
CREATE INDEX idx_participants_user ON public.participants(user_id);
CREATE INDEX idx_matches_room ON public.matches(room_id);
CREATE INDEX idx_matches_room_round ON public.matches(room_id, round);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);

-- ============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users: todos podem ver, apenas o próprio pode editar
CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());

-- Rooms: participantes podem ver, criador pode editar
CREATE POLICY "Anyone can view rooms"
  ON public.rooms FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can create rooms"
  ON public.rooms FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creator can update room"
  ON public.rooms FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Participants
CREATE POLICY "Participants visible to room members"
  ON public.participants FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can join room"
  ON public.participants FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Matches
CREATE POLICY "Matches visible to room members"
  ON public.matches FOR SELECT TO authenticated USING (true);

-- Transactions: apenas o próprio usuário
CREATE POLICY "Users view own transactions"
  ON public.transactions FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users create own transactions"
  ON public.transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Função para criar usuário após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- REALTIME
-- ============================================

-- Habilitar realtime para as tabelas do jogo
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;

// Tipos do Jogo Duelo de Risco

export type CardType = 'win' | 'lose';
export type PlayerAction = 'keep' | 'swap';
export type OpponentDecision = 'accept' | 'reject' | null;
export type MatchStatus = 'waiting' | 'player_a_turn' | 'player_b_deciding' | 'revealing' | 'finished';
export type RoomStatus = 'waiting' | 'bracket_ready' | 'playing' | 'finished';
export type TransactionType = 'deposit' | 'withdraw' | 'bet' | 'prize' | 'platform_fee';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  balance: number; // Em centavos (para evitar float)
  created_at: string;
}

export interface Room {
  id: string;
  code: string; // Código curto para compartilhar (ex: "ABC123")
  name: string;
  status: RoomStatus;
  max_players: number;
  entry_fee: number; // Em centavos, 0 = sem aposta
  created_by: string;
  winner_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  user?: User;
  position?: number; // Posição no bracket
  eliminated: boolean;
  eliminated_at_round?: number;
  joined_at: string;
}

export interface Match {
  id: string;
  room_id: string;
  round: number;
  position: number; // Posição no bracket (para organizar)
  
  // Jogador A (quem vê a carta primeiro)
  player_a_id: string;
  player_a?: User;
  player_a_card: CardType;
  player_a_action?: PlayerAction; // keep ou swap
  player_a_action_at?: string;
  
  // Jogador B (quem decide se aceita a troca)
  player_b_id: string;
  player_b?: User;
  player_b_decision?: OpponentDecision; // accept, reject, ou null se timeout
  player_b_decision_at?: string;
  
  // Resultado
  winner_id?: string;
  winner?: User;
  
  // Controle
  status: MatchStatus;
  started_at: string;
  finished_at?: string;
  
  // Timer
  player_b_deadline?: string; // Quando o tempo do jogador B acaba
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number; // Em centavos
  type: TransactionType;
  status: TransactionStatus;
  room_id?: string;
  match_id?: string;
  pix_code?: string; // Para saques
  description?: string;
  created_at: string;
}

// Tipos para comunicação em tempo real
export interface GameEvent {
  type: 'player_joined' | 'match_started' | 'action_made' | 'decision_made' | 'match_finished' | 'round_finished' | 'tournament_finished';
  room_id: string;
  match_id?: string;
  data: unknown;
  timestamp: string;
}

// Bracket/Torneio
export interface Bracket {
  rounds: Round[];
}

export interface Round {
  number: number;
  matches: Match[];
  status: 'waiting' | 'playing' | 'finished';
}

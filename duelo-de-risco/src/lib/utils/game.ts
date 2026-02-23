import { Match, Room, Participant, CardType } from '@/types/game'

// Gerar código curto para sala (6 caracteres)
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Remove caracteres confusos (0, O, 1, I)
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Sortear carta (50% win, 50% lose)
export function drawCard(): CardType {
  return Math.random() < 0.5 ? 'win' : 'lose'
}

// Criar bracket do torneio
export function createBracket(participants: Participant[]): { round: number; matches: Partial<Match>[] }[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5)
  const rounds: { round: number; matches: Partial<Match>[] }[] = []
  
  let currentRound = 1
  let currentParticipants = shuffled
  
  while (currentParticipants.length > 1) {
    const matches: Partial<Match>[] = []
    
    for (let i = 0; i < currentParticipants.length; i += 2) {
      if (i + 1 < currentParticipants.length) {
        matches.push({
          round: currentRound,
          position: Math.floor(i / 2),
          player_a_id: currentParticipants[i].user_id,
          player_b_id: currentParticipants[i + 1].user_id,
          status: 'waiting'
        })
      }
    }
    
    rounds.push({ round: currentRound, matches })
    
    // Próxima rodada terá a metade de participantes (vencedores)
    const nextRoundParticipants: Participant[] = []
    for (let i = 0; i < matches.length; i++) {
      // Placeholder para vencedores (serão atualizados após cada partida)
      nextRoundParticipants.push({
        id: `winner-${currentRound}-${i}`,
        user_id: '', // Será preenchido depois
        room_id: '',
        eliminated: false,
        joined_at: new Date().toISOString()
      })
    }
    
    currentParticipants = nextRoundParticipants
    currentRound++
  }
  
  return rounds
}

// Determinar vencedor da partida
export function determineWinner(
  playerACard: CardType,
  playerAAction: 'keep' | 'swap',
  playerBDecision: 'accept' | 'reject' | null
): { winnerCard: CardType; swapped: boolean } {
  // Se jogador B aceitou a troca, as cartas são trocadas
  const swapped = playerBDecision === 'accept'
  
  // Se não houve troca, jogador A fica com sua carta original
  // Se houve troca, jogador A fica com a carta do jogador B (que é o oposto)
  const finalCardA = swapped ? (playerACard === 'win' ? 'lose' : 'win') : playerACard
  
  // Vencedor é quem tem 'win'
  return { winnerCard: finalCardA, swapped }
}

// Calcular prêmio do torneio
export function calculatePrize(entryFee: number, numPlayers: number): {
  total: number
  platformFee: number
  prize: number
} {
  const total = entryFee * numPlayers
  const platformFee = Math.floor(total * 0.1) // 10% da plataforma
  const prize = total - platformFee
  
  return { total, platformFee, prize }
}

// Formatar valor em centavos para reais
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

// Formatar tempo restante
export function formatTimeRemaining(deadline: string): string {
  const remaining = new Date(deadline).getTime() - Date.now()
  if (remaining <= 0) return '00:00'
  
  const seconds = Math.floor(remaining / 1000)
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

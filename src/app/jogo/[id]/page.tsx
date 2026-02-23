'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Match, User, CardType } from '@/types/game'
import { 
  Shield, RefreshCw, CheckCircle, XCircle, Timer,
  Trophy, AlertCircle, Loader2, ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { formatTimeRemaining, drawCard } from '@/lib/utils/game'

export default function JogoPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  const [match, setMatch] = useState<(Match & { player_a: User, player_b: User }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<'keep' | 'swap' | null>(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const loadMatch = useCallback(async () => {
    if (!id) return
    
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player_a:users!matches_player_a_id_fkey(*),
        player_b:users!matches_player_b_id_fkey(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      toast.error('Partida não encontrada')
      router.push('/')
      return
    }
    
    setMatch(data)
    setLoading(false)
  }, [id, router, supabase])

  useEffect(() => {
    loadMatch()
  }, [loadMatch])

  // Realtime subscription
  useEffect(() => {
    if (!id) return undefined

    const channel = supabase
      .channel(`match:${id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `id=eq.${id}` },
        () => loadMatch()
      )
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [id, loadMatch, supabase])

  // Timer
  useEffect(() => {
    if (!match?.player_b_deadline) return

    const interval = setInterval(() => {
      const remaining = new Date(match.player_b_deadline!).getTime() - Date.now()
      setTimeLeft(formatTimeRemaining(match.player_b_deadline!))
      
      // Verificar timeout
      if (remaining <= 0 && match.status === 'player_b_deciding') {
        handleTimeout()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [match?.player_b_deadline, match?.status])

  // Calcular porcentagem do tempo restante
  const getTimeProgress = () => {
    if (!match?.player_b_deadline) return 100
    const total = 60000 // 60 segundos
    const remaining = new Date(match.player_b_deadline).getTime() - Date.now()
    return Math.max(0, Math.min(100, (remaining / total) * 100))
  }

  // Verificar se está acabando o tempo (< 10s)
  const isTimeRunningOut = () => {
    if (!match?.player_b_deadline) return false
    const remaining = new Date(match.player_b_deadline).getTime() - Date.now()
    return remaining <= 10000 // 10 segundos
  }

  const handleTimeout = async () => {
    if (!match || isProcessing) return
    
    setIsProcessing(true)
    try {
      await processResult(match.player_a_action || 'keep', null)
    } finally {
      setIsProcessing(false)
    }
  }

  const processResult = async (action: 'keep' | 'swap', decision: 'accept' | 'reject' | null) => {
    if (!match) return

    const playerACard = match.player_a_card as CardType
    const finalCardA = decision === 'accept' 
      ? (playerACard === 'win' ? 'lose' : 'win')
      : playerACard
    
    const winnerId = finalCardA === 'win' ? match.player_a_id : match.player_b_id

    // Atualizar partida
    await supabase
      .from('matches')
      .update({
        player_a_action: action,
        player_b_decision: decision,
        winner_id: winnerId,
        status: 'finished',
        finished_at: new Date().toISOString()
      })
      .eq('id', match.id)

    // Verificar se é a final
    const { data: roomMatches } = await supabase
      .from('matches')
      .select('*')
      .eq('room_id', match.room_id)

    const currentRound = match.round
    const roundMatches = roomMatches?.filter((m: { round: number }) => m.round === currentRound) || []
    const finishedRoundMatches = roundMatches.filter((m: { status: string }) => m.status === 'finished')

    // Se todas as partidas da rodada terminaram
    if (finishedRoundMatches.length === roundMatches.length) {
      const winners = finishedRoundMatches.map((m: { winner_id: string }) => m.winner_id)
      
      // Se só tem um vencedor, é o campeão
      if (winners.length === 1) {
        await supabase
          .from('rooms')
          .update({ 
            status: 'finished',
            winner_id: winners[0]
          })
          .eq('id', match.room_id)
      } else {
        // Criar próxima rodada
        const nextRound = currentRound + 1
        const newMatches = []
        for (let i = 0; i < winners.length; i += 2) {
          if (i + 1 < winners.length) {
            newMatches.push({
              room_id: match.room_id,
              round: nextRound,
              position: i / 2,
              player_a_id: winners[i],
              player_b_id: winners[i + 1],
              player_a_card: drawCard(),
              status: 'player_a_turn',
              started_at: new Date().toISOString()
            })
          }
        }
        
        if (newMatches.length > 0) {
          await supabase.from('matches').insert(newMatches)
        }
      }
    }

    toast.success(decision === null ? 'Tempo esgotado!' : 'Partida finalizada!')
  }

  const makeAction = async (action: 'keep' | 'swap') => {
    if (!match || isProcessing) return
    
    setIsProcessing(true)
    try {
      const deadline = new Date(Date.now() + 60000).toISOString() // 60 segundos
      
      await supabase
        .from('matches')
        .update({
          player_a_action: action,
          status: 'player_b_deciding',
          player_b_deadline: deadline
        })
        .eq('id', match.id)
      
      setSelectedAction(action)
      toast.success(action === 'keep' ? 'Você escolheu manter' : 'Você quer trocar!')
    } catch (error) {
      toast.error('Erro ao fazer jogada')
    } finally {
      setIsProcessing(false)
    }
  }

  const makeDecision = async (decision: 'accept' | 'reject') => {
    if (!match || isProcessing) return
    
    setIsProcessing(true)
    try {
      await processResult(match.player_a_action || 'keep', decision)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!match || !user) return null

  const isPlayerA = match.player_a_id === user.id
  const isPlayerB = match.player_b_id === user.id
  const myCard = isPlayerA ? match.player_a_card : (match.player_a_card === 'win' ? 'lose' : 'win')

  // Tela de resultado
  if (match.status === 'finished') {
    const iWon = match.winner_id === user.id
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto pt-12">
          <Card className={`text-center py-12 ${iWon ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
            <CardContent>
              {iWon ? (
                <Trophy className="w-20 h-20 mx-auto text-green-400 mb-4" />
              ) : (
                <XCircle className="w-20 h-20 mx-auto text-red-400 mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2">
                {iWon ? 'Você Venceu!' : 'Você Perdeu!'}
              </h1>
              <p className="text-slate-300 mb-6">
                {match.player_a.name} tinha: {match.player_a_card === 'win' ? 'VITÓRIA' : 'DERROTA'}
              </p>
              <Button onClick={() => router.push(`/sala/${match.room_id}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Sala
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Tela do Jogador A (quem vê a carta)
  if (isPlayerA && match.status === 'player_a_turn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto pt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-slate-400 mb-2">Sua carta é:</p>
            <div className={`inline-block px-6 py-4 rounded-2xl text-2xl font-bold ${
              match.player_a_card === 'win' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-500' 
                : 'bg-red-500/20 text-red-400 border-2 border-red-500'
            }`}>
              {match.player_a_card === 'win' ? '🏆 VITÓRIA' : '💀 DERROTA'}
            </div>
          </div>

          {/* Adversário */}
          <div className="text-center mb-8">
            <p className="text-slate-400 mb-4">Contra:</p>
            <div className="flex items-center justify-center gap-3">
              {match.player_b?.avatar ? (
                <img src={match.player_b.avatar} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-700" />
              )}
              <span className="text-lg">{match.player_b?.name}</span>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-4">
            <p className="text-center text-slate-300 mb-4">
              O que você quer fazer?
            </p>
            
            <Button 
              onClick={() => makeAction('keep')}
              disabled={isProcessing}
              className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700"
            >
              <Shield className="w-6 h-6 mr-3" />
              MANTER
              <span className="block text-xs text-blue-300 mt-1">
                Ficar com minha carta
              </span>
            </Button>

            <Button 
              onClick={() => makeAction('swap')}
              disabled={isProcessing}
              variant="outline"
              className="w-full h-20 text-lg border-amber-500 text-amber-400 hover:bg-amber-500/10"
            >
              <RefreshCw className="w-6 h-6 mr-3" />
              TROCAR
              <span className="block text-xs text-amber-300 mt-1">
                Oferecer troca ao adversário
              </span>
            </Button>
          </div>

          {/* Dica */}
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400 text-center">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Se trocar, seu adversário decide se aceita ou recusa
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tela do Jogador A aguardando
  if (isPlayerA && match.status === 'player_b_deciding') {
    const progress = getTimeProgress()
    const runningOut = isTimeRunningOut()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto pt-12 text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-amber-400" />
          <h2 className="text-2xl font-bold mb-4">Aguardando {match.player_b?.name}</h2>
          <p className="text-slate-400 mb-6">
            Você escolheu: {match.player_a_action === 'keep' ? 'MANTER' : 'TROCAR'}
          </p>
          
          {/* Timer com barra de progresso */}
          <div className={`bg-slate-800 rounded-2xl p-6 border-2 ${runningOut ? 'border-red-500 animate-pulse' : 'border-amber-500/30'}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className={`w-6 h-6 ${runningOut ? 'text-red-400' : 'text-amber-400'}`} />
              <span className={`text-5xl font-mono font-bold ${runningOut ? 'text-red-400' : 'text-amber-400'}`}>
                {timeLeft}
              </span>
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${runningOut ? 'bg-red-500' : 'bg-amber-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {runningOut && (
              <p className="text-red-400 text-sm mt-3 font-medium">
                ⏰ Tempo acabando!
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Tela do Jogador B decidindo
  if (isPlayerB && match.status === 'player_b_deciding') {
    const progress = getTimeProgress()
    const runningOut = isTimeRunningOut()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto pt-8">
          {/* Timer com barra de progresso */}
          <div className={`bg-slate-800 rounded-2xl p-6 mb-8 border-2 ${runningOut ? 'border-red-500 animate-pulse' : 'border-amber-500/30'}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className={`w-6 h-6 ${runningOut ? 'text-red-400' : 'text-amber-400'}`} />
              <span className={`text-5xl font-mono font-bold ${runningOut ? 'text-red-400' : 'text-amber-400'}`}>
                {timeLeft}
              </span>
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${runningOut ? 'bg-red-500' : 'bg-amber-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {runningOut && (
              <p className="text-red-400 text-sm mt-3 font-medium text-center">
                ⚠️ Decida rápido! Tempo acabando!
              </p>
            )}
          </div>

          {/* Aviso */}
          <div className="text-center mb-8">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500 mb-4">
              SUA VEZ
            </Badge>
            <h2 className="text-2xl font-bold mb-2">
              {match.player_a?.name} quer TROCAR!
            </h2>
            <p className="text-slate-400">
              Você não sabe a carta dele. Aceita a troca?
            </p>
          </div>

          {/* Ações */}
          <div className="space-y-4">
            <Button 
              onClick={() => makeDecision('reject')}
              disabled={isProcessing}
              className="w-full h-20 text-lg bg-red-600 hover:bg-red-700"
            >
              <XCircle className="w-6 h-6 mr-3" />
              RECUSAR
              <span className="block text-xs text-red-300 mt-1">
                Ficar com minha carta atual
              </span>
            </Button>

            <Button 
              onClick={() => makeDecision('accept')}
              disabled={isProcessing}
              className="w-full h-20 text-lg bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-6 h-6 mr-3" />
              ACEITAR
              <span className="block text-xs text-green-300 mt-1">
                Trocar cartas com {match.player_a?.name}
              </span>
            </Button>
          </div>

          {/* Dica */}
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400 text-center">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Pense bem! Se ele quer trocar, talvez tenha uma carta ruim...
              Ou está blefando!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tela do Jogador B aguardando
  if (isPlayerB && match.status === 'player_a_turn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto pt-12 text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">Aguardando {match.player_a?.name}</h2>
          <p className="text-slate-400">
            Ele está decidindo se mantém ou oferece troca...
          </p>
        </div>
      </div>
    )
  }

  return null
}

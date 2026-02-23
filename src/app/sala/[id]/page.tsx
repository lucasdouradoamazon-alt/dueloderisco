'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Room, Participant, Match, User } from '@/types/game'
import { 
  Users, Play, Share2, Crown, Loader2, LogOut, 
  Trophy, Swords, ChevronRight 
} from 'lucide-react'
import { toast } from 'sonner'
import { drawCard } from '@/lib/utils/game'

export default function SalaPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  const [room, setRoom] = useState<Room | null>(null)
  const [participants, setParticipants] = useState<(Participant & { user: User })[]>([])
  const [matches, setMatches] = useState<(Match & { player_a: User, player_b: User })[]>([])
  const [loading, setLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    
    // Carregar sala
    const { data: roomData } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()
    
    if (roomData) setRoom(roomData)

    // Carregar participantes com dados do usuário
    const { data: participantsData } = await supabase
      .from('participants')
      .select(`
        *,
        user:users(*)
      `)
      .eq('room_id', id)
      .order('joined_at', { ascending: true })
    
    if (participantsData) setParticipants(participantsData)

    // Carregar partidas
    const { data: matchesData } = await supabase
      .from('matches')
      .select(`
        *,
        player_a:users!matches_player_a_id_fkey(*),
        player_b:users!matches_player_b_id_fkey(*)
      `)
      .eq('room_id', id)
      .order('round', { ascending: true })
      .order('position', { ascending: true })
    
    if (matchesData) setMatches(matchesData)
    
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Realtime subscriptions
  useEffect(() => {
    if (!id) return

    const participantsChannel = supabase
      .channel(`participants:${id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${id}` },
        () => loadData()
      )
      .subscribe()

    const matchesChannel = supabase
      .channel(`matches:${id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `room_id=eq.${id}` },
        () => loadData()
      )
      .subscribe()

    const roomChannel = supabase
      .channel(`room:${id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${id}` },
        () => loadData()
      )
      .subscribe()

    return () => {
      participantsChannel.unsubscribe()
      matchesChannel.unsubscribe()
      roomChannel.unsubscribe()
    }
  }, [id, loadData, supabase])

  const shareRoom = async () => {
    if (!room) return
    
    const url = `${window.location.origin}?join=${room.code}`
    
    if (navigator.share) {
      await navigator.share({
        title: 'Duelo de Risco',
        text: `Entre na sala ${room.name} com código: ${room.code}`,
        url
      })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado!')
    }
  }

  const startTournament = async () => {
    if (!room || !user || participants.length < 2) return
    
    if (participants.length % 2 !== 0) {
      toast.error('Precisa de número par de jogadores')
      return
    }

    setIsStarting(true)
    try {
      // Embaralhar participantes
      const shuffled = [...participants].sort(() => Math.random() - 0.5)
      
      // Criar primeira rodada
      const matches = []
      for (let i = 0; i < shuffled.length; i += 2) {
        matches.push({
          room_id: room.id,
          round: 1,
          position: i / 2,
          player_a_id: shuffled[i].user_id,
          player_b_id: shuffled[i + 1].user_id,
          status: 'player_a_turn'
        })
      }

      // Inserir partidas
      const { error: matchesError } = await supabase
        .from('matches')
        .insert(matches)

      if (matchesError) throw matchesError

      // Atualizar status da sala
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ status: 'playing' })
        .eq('id', room.id)

      if (roomError) throw roomError

      // Iniciar primeira partida para cada par
      for (const match of matches) {
        await supabase
          .from('matches')
          .update({ 
            player_a_card: drawCard(),
            started_at: new Date().toISOString()
          })
          .eq('id', match.room_id)
      }

      toast.success('Torneio iniciado!')
    } catch (error) {
      toast.error('Erro ao iniciar torneio')
      console.error(error)
    } finally {
      setIsStarting(false)
    }
  }

  const leaveRoom = async () => {
    if (!room || !user) return
    
    await supabase
      .from('participants')
      .delete()
      .eq('room_id', room.id)
      .eq('user_id', user.id)
    
    router.push('/')
  }

  const getMyCurrentMatch = () => {
    if (!user) return null
    return matches.find(m => 
      (m.player_a_id === user.id || m.player_b_id === user.id) &&
      m.status !== 'finished'
    )
  }

  const myMatch = getMyCurrentMatch()
  const isCreator = room?.created_by === user?.id
  const canStart = isCreator && room?.status === 'waiting' && participants.length >= 2 && participants.length % 2 === 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p>Sala não encontrada</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">{room.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                Código: {room.code}
              </Badge>
              <Badge variant={room.status === 'playing' ? 'default' : 'secondary'} 
                className={room.status === 'playing' ? 'bg-green-600' : 'bg-slate-700'}>
                {room.status === 'waiting' ? 'Aguardando' : 
                 room.status === 'playing' ? 'Em andamento' : 'Finalizado'}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={leaveRoom}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Ações */}
        {room.status === 'waiting' && (
          <div className="space-y-3 mb-6">
            <Button 
              onClick={shareRoom}
              variant="outline" 
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Convidar Jogadores
            </Button>
            
            {canStart && (
              <Button 
                onClick={startTournament}
                disabled={isStarting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Iniciar Torneio
              </Button>
            )}
          </div>
        )}

        {/* Minha Partida Atual */}
        {myMatch && room.status === 'playing' && (
          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/50 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-400 mb-1">Sua vez!</p>
                  <p className="font-semibold">
                    {myMatch.player_a_id === user?.id ? 'É sua vez de jogar' : 'Aguardando oponente'}
                  </p>
                </div>
                <Button 
                  onClick={() => router.push(`/jogo/${myMatch.id}`)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Jogar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="w-full bg-slate-800">
            <TabsTrigger value="players" className="flex-1">
              <Users className="w-4 h-4 mr-1" />
              Jogadores ({participants.length})
            </TabsTrigger>
            <TabsTrigger value="bracket" className="flex-1">
              <Swords className="w-4 h-4 mr-1" />
              Chave
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="mt-4">
            <div className="space-y-2">
              {participants.map((p, index) => (
                <Card key={p.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 w-6">#{index + 1}</span>
                      {p.user?.avatar ? (
                        <img 
                          src={p.user.avatar} 
                          alt={p.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          {p.user?.name?.[0] || '?'}
                        </div>
                      )}
                      <span className="font-medium">
                        {p.user?.name}
                        {p.user_id === room.created_by && (
                          <Crown className="w-4 h-4 inline ml-1 text-amber-400" />
                        )}
                      </span>
                    </div>
                    {p.eliminated && (
                      <Badge variant="destructive">Eliminado</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bracket" className="mt-4">
            {matches.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-8 text-center text-slate-400">
                  <Swords className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>O torneio ainda não começou</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {Array.from(new Set(matches.map(m => m.round))).map(round => (
                  <div key={round}>
                    <h3 className="text-sm font-medium text-slate-400 mb-2">
                      {round === Math.max(...matches.map(m => m.round)) && matches.filter(m => m.round === round).length === 1
                        ? 'Final'
                        : round === Math.max(...matches.map(m => m.round)) - 1 && matches.filter(m => m.round === round).length === 2
                        ? 'Semifinal'
                        : `Rodada ${round}`}
                    </h3>
                    <div className="space-y-2">
                      {matches.filter(m => m.round === round).map(match => (
                        <Card key={match.id} 
                          className={`border-slate-700 ${
                            match.status === 'finished' 
                              ? 'bg-slate-800/30' 
                              : 'bg-slate-800/80'
                          }`}>
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className={`flex items-center gap-2 ${
                                  match.winner_id === match.player_a_id ? 'text-amber-400' : ''
                                } ${match.winner_id && match.winner_id !== match.player_a_id ? 'opacity-50' : ''}`}>
                                  {match.player_a?.avatar ? (
                                    <img src={match.player_a.avatar} alt="" className="w-6 h-6 rounded-full" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-700" />
                                  )}
                                  <span className="text-sm truncate">{match.player_a?.name}</span>
                                  {match.winner_id === match.player_a_id && (
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                  )}
                                </div>
                              </div>
                              
                              <span className="text-slate-500 mx-2">vs</span>
                              
                              <div className="flex-1">
                                <div className={`flex items-center gap-2 justify-end ${
                                  match.winner_id === match.player_b_id ? 'text-amber-400' : ''
                                } ${match.winner_id && match.winner_id !== match.player_b_id ? 'opacity-50' : ''}`}>
                                  {match.winner_id === match.player_b_id && (
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                  )}
                                  <span className="text-sm truncate">{match.player_b?.name}</span>
                                  {match.player_b?.avatar ? (
                                    <img src={match.player_b.avatar} alt="" className="w-6 h-6 rounded-full" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-700" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

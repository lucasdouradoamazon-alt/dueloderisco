'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useSupabase'
import { createClient } from '@/lib/supabase/client'
import { generateRoomCode } from '@/lib/utils/game'
import { useRouter } from 'next/navigation'
import { Sword, Users, Trophy, ArrowRight, Loader2, Play, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && !url.includes('placeholder') && key
}

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const hasSupabase = isSupabaseConfigured()

  const createRoom = async () => {
    if (!user) {
      toast.error('Faça login para criar uma sala')
      return
    }

    setIsCreating(true)
    try {
      const code = generateRoomCode()
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({
          code,
          name: `Sala de ${user.user_metadata?.name?.split(' ')[0] || 'Anônimo'}`,
          created_by: user.id,
          status: 'waiting'
        })
        .select()
        .single()

      if (error) throw error

      await supabase.from('participants').insert({
        room_id: room.id,
        user_id: user.id
      })

      toast.success('Sala criada!')
      router.push(`/sala/${room.id}`)
    } catch (error) {
      toast.error('Erro ao criar sala')
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const joinRoom = async () => {
    if (!user) {
      toast.error('Faça login para entrar em uma sala')
      return
    }

    if (!roomCode.trim()) {
      toast.error('Digite o código da sala')
      return
    }

    setIsJoining(true)
    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode.toUpperCase())
        .single()

      if (roomError || !room) {
        toast.error('Sala não encontrada')
        return
      }

      if (room.status !== 'waiting') {
        toast.error('Esta sala já iniciou o jogo')
        return
      }

      const { data: existing } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', room.id)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        router.push(`/sala/${room.id}`)
        return
      }

      const { error } = await supabase.from('participants').insert({
        room_id: room.id,
        user_id: user.id
      })

      if (error) throw error

      toast.success('Você entrou na sala!')
      router.push(`/sala/${room.id}`)
    } catch (error) {
      toast.error('Erro ao entrar na sala')
      console.error(error)
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 safe-area-top safe-area-bottom">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header - Otimizado para mobile */}
        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mb-5 shadow-2xl shadow-amber-500/20">
            <Sword className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Duelo de Risco
          </h1>
          <p className="text-slate-400 text-sm">Blefe, estratégia e coragem</p>
        </div>

        {/* Alerta de configuração */}
        {!hasSupabase && (
          <Card className="bg-amber-500/10 border-amber-500/50 mb-6">
            <CardContent className="py-4 px-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-200 font-medium">Modo Demo Ativo</p>
                <p className="text-xs text-amber-300/80 mt-1">
                  Supabase não configurado. Use o Modo Demo para testar!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Users, color: "text-blue-400", label: "2+ Jogadores" },
            { icon: Sword, color: "text-red-400", label: "Blefe & Troca" },
            { icon: Trophy, color: "text-amber-400", label: "Prêmio Final" },
          ].map((feat, i) => (
            <div key={i} className="text-center">
              <div className="bg-slate-800/50 rounded-xl p-3 mb-2">
                <feat.icon className={`w-6 h-6 mx-auto ${feat.color}`} />
              </div>
              <p className="text-xs text-slate-400">{feat.label}</p>
            </div>
          ))}
        </div>

        {!user ? (
          <div className="space-y-4">
            {hasSupabase && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-white text-lg">Começar a Jogar</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Entre com sua conta Google
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={signInWithGoogle}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 h-14 text-base"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Entrar com Google
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasSupabase && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-900 px-4 text-sm text-slate-500">ou</span>
                </div>
              </div>
            )}

            <Link href="/demo" className="block">
              <Button 
                variant="outline" 
                className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10 h-16 text-base"
              >
                <Play className="w-5 h-5 mr-2" />
                Testar Modo Demo
                <Badge className="ml-2 bg-amber-500/20 text-amber-400 text-xs">Sem login</Badge>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Criar Sala</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Inicie uma nova partida
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={createRoom}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 h-14 text-base"
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sword className="w-5 h-5 mr-2" />Criar Nova Sala</>}
                </Button>
              </CardContent>
            </Card>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-900 px-4 text-sm text-slate-500">ou</span>
              </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Entrar em Sala</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Digite o código de 6 caracteres
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest bg-slate-900 border-slate-600 text-white placeholder:text-slate-600 h-14"
                />
                <Button 
                  onClick={joinRoom}
                  disabled={isJoining || roomCode.length < 6}
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-700 h-14 text-base"
                >
                  {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5 mr-2" />Entrar</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-6 pb-4 space-y-3">
          <Link href="/testar-celular" className="text-green-400 text-sm hover:underline block font-medium">
            📱 Testar no celular agora
          </Link>
          <Link href="/como-instalar" className="text-amber-400 text-sm hover:underline block">
            ⬇️ Como instalar no celular
          </Link>
          <Link href="/configurar-google" className="text-red-400 text-sm hover:underline block">
            🔐 Configurar Google Login
          </Link>
          <Link href="/ajuda-celular" className="text-blue-400 text-xs hover:underline block">
            ❓ Problemas de conexão?
          </Link>
          <p className="text-slate-500 text-xs pt-2">
            Otimo para jogar em grupo • V1.0 MVP
          </p>
        </div>
      </div>
    </main>
  )
}

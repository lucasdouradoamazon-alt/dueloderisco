'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Se for mock (Supabase não configurado), não tenta autenticar
    if (!supabase.auth.getUser) {
      setLoading(false)
      return
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: { user: User | null } | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const supabase = createClient()
    if (!supabase.auth.signInWithOAuth) {
      alert('Supabase não configurado. Use o Modo Demo!')
      return
    }
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const signOut = async () => {
    const supabase = createClient()
    if (!supabase.auth.signOut) return
    await supabase.auth.signOut()
  }

  return { user, loading, signInWithGoogle, signOut }
}

export function useRealtimeRoom(roomId: string) {
  const [participants, setParticipants] = useState([])
  const [matches, setMatches] = useState([])
  
  useEffect(() => {
    if (!roomId) return

    const supabase = createClient()
    
    // Se for mock, não tenta conectar
    if (!supabase.channel) return

    // Canal para participantes
    const participantsChannel = supabase
      .channel(`room:${roomId}:participants`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        (_payload: unknown) => {
          console.log('Participant change:', _payload)
        }
      )
      .subscribe()

    // Canal para partidas
    const matchesChannel = supabase
      .channel(`room:${roomId}:matches`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `room_id=eq.${roomId}` },
        (_payload: unknown) => {
          console.log('Match change:', _payload)
        }
      )
      .subscribe()

    return () => {
      participantsChannel?.unsubscribe()
      matchesChannel?.unsubscribe()
    }
  }, [roomId])

  return { participants, matches }
}

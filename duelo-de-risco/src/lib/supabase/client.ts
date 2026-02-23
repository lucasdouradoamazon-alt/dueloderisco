import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Verifica se está configurado
const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseKey

// Cliente para uso no browser
export const createClient = () => {
  if (!isConfigured) {
    console.warn('⚠️ Supabase não configurado. Modo Demo ativado.')
    // Retorna mock para não quebrar
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase não configurado') }),
            order: () => Promise.resolve({ data: [], error: null }),
          }),
          single: () => Promise.resolve({ data: null, error: new Error('Supabase não configurado') }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase não configurado') }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: new Error('Supabase não configurado') }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      }),
    } as any
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Cliente para uso no servidor
export const supabase = isConfigured 
  ? createSupabaseClient(supabaseUrl, supabaseKey)
  : null

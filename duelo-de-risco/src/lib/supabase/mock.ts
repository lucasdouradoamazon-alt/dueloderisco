// Mock para testes sem Supabase configurado
import { User, Room, Match, Participant } from "@/types/game";

const mockUsers: User[] = [
  {
    id: "demo-user-1",
    name: "Jogador 1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    balance: 1000,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-user-2",
    name: "Jogador 2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    balance: 1000,
    created_at: new Date().toISOString(),
  },
];

let mockRooms: Room[] = [];
let mockParticipants: Participant[] = [];
let mockMatches: Match[] = [];

export const mockSupabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error("Mock mode") }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      single: () => Promise.resolve({ data: null, error: new Error("Mock mode") }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ data: null, error: new Error("Mock mode") }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: new Error("Mock mode") }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
  }),
};

export function isMockMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL === "sua_url_do_supabase";
}

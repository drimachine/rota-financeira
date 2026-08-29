import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Rota Financeira] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configurados. ' +
    'Crie um arquivo .env na pasta frontend com essas variáveis (Project Settings > API no Supabase).'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

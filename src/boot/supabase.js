import {
  createClient
} from '@supabase/supabase-js'
import useAuthUser from 'src/composables/UseAuthUser'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

/* Atualizando o usuário no supabase */
supabase.auth.onAuthStateChange((event, session) => {
  const {
    user
  } = useAuthUser()
  /* Identificando a atualização no supabase */
  user.value = session ?.user || null
})

/* console.log('init supabase:', supabase) */

export default function useSupabase() {
  return {
    supabase
  }
}

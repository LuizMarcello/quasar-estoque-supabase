import {
  createClient
} from '@supabase/supabase-js'
import useAuthUser from 'src/composables/UseAuthUser'

const supabaseUrl = 'https://rttsyqnyfwkhsveqjgtp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dHN5cW55ZndraHN2ZXFqZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1NzkwNDksImV4cCI6MTk4MDE1NTA0OX0.qKdYjbeLEsjfIfpSrE72g0X73Dx4Re-69l8eWZ2u8Sg'
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

// lib/auth.ts
import { supabase } from './supabaseClient'

export const signInWithGoogle = async () => {
  console.log('Google Sign-In button clicked')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) {
    console.error('Error during Google sign-in:', error.message)
  }
}

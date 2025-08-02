// lib/auth.ts
import { supabase } from './supabaseClient'

export const signInWithGoogle = async () => {
  console.log('Google Sign-In button clicked')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    console.error('Error during Google sign-in:', error.message)
  }
}

// Temporary email/password sign-in (for testing)
export const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Error during email sign-in:', error.message)
    throw error
  }
}

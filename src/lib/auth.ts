// lib/auth.ts
import { supabase } from './supabaseClient'

export const signInWithGoogle = async () => {
  console.log('Google Sign-In button clicked')  // ✅ Add this
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) {
    console.error('Google sign-in error:', error.message)
  }
}


export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign Out Error:', error.message)
  }
}

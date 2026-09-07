import { supabase } from '../../../lib/supabase'
import type { Tables } from '../../../lib/supabase'

export type ProfileRow = Tables<'profiles'>

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  nombre: string
  apellido: string
}

export async function signInWithEmail({ email, password }: SignInCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) throw error
  return data
}

export async function signUpWithEmail({ email, password, nombre, apellido }: SignUpCredentials) {
  const cleanEmail = email.trim().toLowerCase()
  const cleanNombre = nombre.trim()
  const cleanApellido = apellido.trim()

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        nombre: cleanNombre,
        apellido: cleanApellido,
        role: 'trainer',
      },
    },
  })

  if (error) throw error

  // If user is returned, ensure profile exists
  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: 'trainer',
        nombre: cleanNombre,
        apellido: cleanApellido,
      })
    } catch {
      // Handled by DB trigger if already exists
    }
  }

  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUserProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.warn('Could not fetch user profile:', error)
    return null
  }
  return data
}

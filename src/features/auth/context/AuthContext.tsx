import React, { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase'
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  getCurrentUserProfile,
  type SignInCredentials,
  type SignUpCredentials,
  type ProfileRow,
} from '../api/auth.api'
import { AuthContext } from './auth-context-base'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadProfile = async (userId: string) => {
    try {
      const p = await getCurrentUserProfile(userId)
      setProfile(p)
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  useEffect(() => {
    // Initial active session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen to changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await loadProfile(newSession.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (credentials: SignInCredentials) => {
    setLoading(true)
    try {
      const data = await signInWithEmail(credentials)
      setUser(data.user)
      setSession(data.session)
      if (data.user) {
        await loadProfile(data.user.id)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (credentials: SignUpCredentials) => {
    setLoading(true)
    try {
      const data = await signUpWithEmail(credentials)
      const requiresConfirmation = !data.session
      if (data.user && data.session) {
        setUser(data.user)
        setSession(data.session)
        await loadProfile(data.user.id)
      }
      return { requiresConfirmation }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOutUser()
      setUser(null)
      setSession(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

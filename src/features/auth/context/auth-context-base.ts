import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type {
  SignInCredentials,
  SignUpCredentials,
  ProfileRow,
} from '../api/auth.api'

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: ProfileRow | null
  loading: boolean
  signIn: (credentials: SignInCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<{ requiresConfirmation: boolean }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Tables, InsertTables, UpdateTables } from '../../../lib/supabase'
import { clientKeys, sessionKeys } from '../../../lib/queryKeys'

export type ClientRow = Tables<'clients'>
export type WorkoutSessionRow = Tables<'workout_sessions'>
export type SessionExerciseRow = Tables<'session_exercises'>
export type ExerciseRow = Tables<'exercises'>
export type WeightEntryRow = Tables<'weight_entries'>
export type WeightEntryInsert = InsertTables<'weight_entries'>
export type SessionExerciseUpdate = UpdateTables<'session_exercises'>

export type SessionExerciseWithExercise = SessionExerciseRow & {
  exercises: ExerciseRow | null
}

export type WorkoutSessionWithExercises = WorkoutSessionRow & {
  session_exercises: SessionExerciseWithExercise[]
}

export interface UpdateSessionProgressInput {
  id: string
  sessionId?: string
  sets_completados?: number
  peso_registrado?: number | null
  notes?: string | null
}

/**
 * Hook to fetch client profile from the 'clients' table by ID.
 * Returns the client row.
 */
export function useClientProfile(clienteId: string) {
  return useQuery({
    queryKey: clientKeys.detail(clienteId),
    queryFn: async (): Promise<ClientRow> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clienteId)
        .single()

      if (error) {
        throw error
      }

      return data
    },
    enabled: Boolean(clienteId),
  })
}

/**
 * Hook to fetch workout sessions for a client with their session exercises and exercise details.
 * Ordered by session date ascending.
 */
export function useClientSessions(clienteId: string) {
  return useQuery({
    queryKey: clientKeys.sessions(clienteId),
    queryFn: async (): Promise<WorkoutSessionWithExercises[]> => {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*, session_exercises(*, exercises(*))')
        .eq('client_id', clienteId)
        .order('fecha')

      if (error) {
        throw error
      }

      return (data as unknown as WorkoutSessionWithExercises[]) ?? []
    },
    enabled: Boolean(clienteId),
  })
}

/**
 * Hook to fetch weight entries for a specific client + exercise combo,
 * ordered by date ascending.
 */
export function useWeightHistory(clientId: string, exerciseId: string) {
  return useQuery({
    queryKey: clientKeys.weightHistory(clientId, exerciseId),
    queryFn: async (): Promise<WeightEntryRow[]> => {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('client_id', clientId)
        .eq('exercise_id', exerciseId)
        .order('fecha', { ascending: true })

      if (error) {
        throw error
      }

      return data ?? []
    },
    enabled: Boolean(clientId && exerciseId),
  })
}

/**
 * Mutation hook to insert a weight entry into 'weight_entries'.
 * On success, invalidates matching client weight history.
 */
export function useLogWeight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newEntry: WeightEntryInsert): Promise<WeightEntryRow> => {
      const { data, error } = await supabase
        .from('weight_entries')
        .insert(newEntry)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: (data) => {
      if (data?.client_id && data?.exercise_id) {
        queryClient.invalidateQueries({
          queryKey: clientKeys.weightHistory(data.client_id, data.exercise_id),
        })
      }
      queryClient.invalidateQueries({
        queryKey: clientKeys.all,
      })
    },
  })
}

/**
 * Mutation hook to update session_exercises (sets_completados, peso_registrado, etc.).
 * On success, invalidates the session detail and related session / client queries.
 */
export function useUpdateSessionProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      sessionId: _sessionId,
      ...updates
    }: UpdateSessionProgressInput): Promise<SessionExerciseRow> => {
      const { data, error } = await supabase
        .from('session_exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: (data, variables) => {
      const sessionId = data?.session_id || variables.sessionId
      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: sessionKeys.detail(sessionId),
        })
      }
      queryClient.invalidateQueries({
        queryKey: sessionKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: clientKeys.all,
      })
    },
  })
}

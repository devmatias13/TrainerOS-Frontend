import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Tables, InsertTables } from '../../../lib/supabase'
import { clientRoutineKeys, routineKeys } from '../../../lib/queryKeys'
import type { RoutineRow } from '../../workouts/hooks/useRoutines'

export type ClientRoutineRow = Tables<'client_routines'>
export type ClientRoutineInsert = InsertTables<'client_routines'>

export type ClientRoutineWithRoutine = ClientRoutineRow & {
  routines: RoutineRow | null
}

/**
 * Hook to fetch all routines assigned to a specific client.
 * Returns full routine details joined through client_routines.
 */
export function useClientRoutines(clientId: string) {
  return useQuery({
    queryKey: clientRoutineKeys.byClient(clientId),
    queryFn: async (): Promise<ClientRoutineWithRoutine[]> => {
      const { data, error } = await supabase
        .from('client_routines')
        .select('*, routines(*)')
        .eq('client_id', clientId)
        .order('assigned_at', { ascending: false })

      if (error) {
        throw error
      }

      return (data as unknown as ClientRoutineWithRoutine[]) ?? []
    },
    enabled: Boolean(clientId),
  })
}

/**
 * Mutation hook to assign a routine to a client.
 * Invalidates the client's routine list on success.
 */
export function useAssignRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      clientId,
      routineId,
    }: {
      clientId: string
      routineId: string
    }): Promise<ClientRoutineRow> => {
      const { data, error } = await supabase
        .from('client_routines')
        .insert({ client_id: clientId, routine_id: routineId })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: clientRoutineKeys.byClient(variables.clientId),
      })
    },
  })
}

/**
 * Mutation hook to unassign (delete) a routine from a client.
 * Invalidates the client's routine list on success.
 */
export function useUnassignRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      clientId,
      routineId,
    }: {
      clientId: string
      routineId: string
    }): Promise<void> => {
      const { error } = await supabase
        .from('client_routines')
        .delete()
        .eq('client_id', clientId)
        .eq('routine_id', routineId)

      if (error) {
        throw error
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: clientRoutineKeys.byClient(variables.clientId),
      })
      queryClient.invalidateQueries({
        queryKey: routineKeys.all,
      })
    },
  })
}

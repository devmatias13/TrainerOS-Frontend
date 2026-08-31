import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Tables, InsertTables, UpdateTables } from '../../../lib/supabase'
import { clientKeys } from '../../../lib/queryKeys'
import type { Database } from '../../../types/database.types'

export type ClientRow = Tables<'clients'>
export type ClientInsert = InsertTables<'clients'>
export type ClientUpdate = UpdateTables<'clients'>

export interface UpdateClientInput {
  id: string
  data: ClientUpdate
}

const STATUS_FILTER_MAP: Record<string, Database['public']['Enums']['client_status']> = {
  activos: 'aldia',
  pendientes: 'pendiente',
  vencer: 'vence',
  aldia: 'aldia',
  pendiente: 'pendiente',
  vence: 'vence',
}

/**
 * Hook to fetch all clients, optionally filtered by status.
 * Maps 'activos' -> 'aldia', 'pendientes' -> 'pendiente', 'vencer' -> 'vence'.
 * Ordered by creation date descending.
 */
export function useClients(statusFilter?: string) {
  return useQuery({
    queryKey: clientKeys.list(statusFilter),
    queryFn: async (): Promise<ClientRow[]> => {
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter && statusFilter !== 'todos') {
        const mappedStatus =
          STATUS_FILTER_MAP[statusFilter] ??
          (statusFilter as Database['public']['Enums']['client_status'])

        query = query.eq('status', mappedStatus)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}

/**
 * Hook to fetch a single client by ID.
 */
export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: async (): Promise<ClientRow> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },
    enabled: Boolean(id),
  })
}

/**
 * Mutation hook to insert a new client.
 * Uses .select().single() to return the created record.
 * Invalidates client queries on success.
 */
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newClient: ClientInsert): Promise<ClientRow> => {
      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}

/**
 * Mutation hook to update a client by ID.
 * Uses .select().single() to return the updated record.
 * Invalidates client queries on success.
 */
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data: updateData }: UpdateClientInput): Promise<ClientRow> => {
      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}

/**
 * Mutation hook to delete a client by ID.
 * Invalidates client queries on success.
 */
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Tables, InsertTables, UpdateTables } from '../../../lib/supabase'
import { exerciseKeys } from '../../../lib/queryKeys'
import type { Database } from '../../../types/database.types'

export type ExerciseRow = Tables<'exercises'>
export type ExerciseInsert = InsertTables<'exercises'>
export type ExerciseUpdate = UpdateTables<'exercises'>

export interface UpdateExerciseInput {
  id: string
  data: ExerciseUpdate
}

/**
 * Hook to fetch all exercises, optionally filtered by muscle group.
 * Ordered by exercise name ascending.
 */
export function useExercises(muscleGroup?: string) {
  return useQuery({
    queryKey: exerciseKeys.list(muscleGroup),
    queryFn: async (): Promise<ExerciseRow[]> => {
      let query = supabase
        .from('exercises')
        .select('*')
        .order('nombre')

      if (muscleGroup && muscleGroup !== 'todos') {
        query = query.eq(
          'grupo_muscular',
          muscleGroup as Database['public']['Enums']['muscle_group']
        )
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
 * Hook to fetch a single exercise by ID.
 */
export function useExercise(id: string) {
  return useQuery({
    queryKey: exerciseKeys.detail(id),
    queryFn: async (): Promise<ExerciseRow> => {
      const { data, error } = await supabase
        .from('exercises')
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
 * Mutation hook to create a new exercise.
 * Invalidates exercise queries on success.
 */
export function useCreateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newExercise: ExerciseInsert): Promise<ExerciseRow> => {
      const { data, error } = await supabase
        .from('exercises')
        .insert(newExercise)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
    },
  })
}

/**
 * Mutation hook to update an existing exercise by ID.
 * Invalidates exercise queries on success.
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data: updateData }: UpdateExerciseInput): Promise<ExerciseRow> => {
      const { data, error } = await supabase
        .from('exercises')
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
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
    },
  })
}

/**
 * Mutation hook to delete an exercise by ID.
 * Invalidates exercise queries on success.
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Tables, InsertTables } from '../../../lib/supabase'
import { routineKeys } from '../../../lib/queryKeys'

export type RoutineRow = Tables<'routines'>
export type RoutineInsert = InsertTables<'routines'>
export type RoutineBlockRow = Tables<'routine_blocks'>
export type RoutineBlockExerciseRow = Tables<'routine_block_exercises'>
export type ExerciseRow = Tables<'exercises'>

export type RoutineBlockExerciseWithExercise = RoutineBlockExerciseRow & {
  exercises: ExerciseRow | null
}

export type RoutineBlockWithExercises = RoutineBlockRow & {
  routine_block_exercises: RoutineBlockExerciseWithExercise[]
}

export type RoutineDetail = RoutineRow & {
  blocks: RoutineBlockWithExercises[]
}

/**
 * Hook to fetch all routines ordered by creation date descending.
 */
export function useRoutines() {
  return useQuery({
    queryKey: routineKeys.list(),
    queryFn: async (): Promise<RoutineRow[]> => {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}

/**
 * Hook to fetch a single routine by ID with its blocks and block exercises.
 * Uses a multi-step query approach:
 * 1. Fetches routine row
 * 2. Fetches routine blocks with nested exercises ordered by order_index
 * 3. Combines into a single nested data structure
 */
export function useRoutine(id: string) {
  return useQuery({
    queryKey: routineKeys.detail(id),
    queryFn: async (): Promise<RoutineDetail> => {
      const { data: routine, error: routineError } = await supabase
        .from('routines')
        .select('*')
        .eq('id', id)
        .single()

      if (routineError) {
        throw routineError
      }

      const { data: blocks, error: blocksError } = await supabase
        .from('routine_blocks')
        .select('*, routine_block_exercises(*, exercises(*))')
        .eq('routine_id', id)
        .order('order_index')

      if (blocksError) {
        throw blocksError
      }

      return {
        ...routine,
        blocks: (blocks as unknown as RoutineBlockWithExercises[]) ?? [],
      }
    },
    enabled: Boolean(id),
  })
}

/**
 * Mutation hook to create a new routine.
 * Invalidates all routine queries on success.
 */
export function useCreateRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newRoutine: RoutineInsert): Promise<RoutineRow> => {
      const { data, error } = await supabase
        .from('routines')
        .insert(newRoutine)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all })
    },
  })
}

export type FullRoutineInsert = RoutineInsert & {
  blocks: {
    label: string
    type: 'single' | 'superset'
    order_index: number
    exercises: {
      exercise_id: string
      sets: number
      reps: string
      order_index: number
    }[]
  }[]
}

/**
 * Mutation hook to create a new routine along with its blocks and exercises.
 */
export function useCreateFullRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FullRoutineInsert): Promise<RoutineRow> => {
      const { blocks, ...newRoutine } = payload
      
      // 1. Create Routine
      const { data: routine, error: routineError } = await supabase
        .from('routines')
        .insert(newRoutine)
        .select()
        .single()

      if (routineError) throw routineError

      // 2. Create Blocks
      if (blocks && blocks.length > 0) {
        const blocksToInsert = blocks.map(b => ({
          routine_id: routine.id,
          label: b.label,
          type: b.type,
          order_index: b.order_index,
        }))

        const { data: insertedBlocks, error: blocksError } = await supabase
          .from('routine_blocks')
          .insert(blocksToInsert)
          .select()

        if (blocksError) throw blocksError

        // 3. Create Exercises
        const exercisesToInsert: any[] = []
        
        insertedBlocks.forEach((insertedBlock, i) => {
          const originalBlock = blocks[i]
          originalBlock.exercises.forEach(ex => {
            exercisesToInsert.push({
              block_id: insertedBlock.id,
              exercise_id: ex.exercise_id,
              sets: ex.sets,
              reps: ex.reps,
              order_index: ex.order_index,
            })
          })
        })

        if (exercisesToInsert.length > 0) {
          const { error: exercisesError } = await supabase
            .from('routine_block_exercises')
            .insert(exercisesToInsert)
          
          if (exercisesError) throw exercisesError
        }
      }

      return routine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all })
    },
  })
}

/**
 * Mutation hook to delete a routine by ID.
 * Invalidates all routine queries on success.
 */
export function useDeleteRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all })
    },
  })
}

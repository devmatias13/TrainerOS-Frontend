// Barrel export for the workouts feature
export { default as RoutineBuilder }    from './components/RoutineBuilder'
export { default as ExercisePicker }    from './components/ExercisePicker'
export { default as BlockCard }         from './components/BlockCard'
export { default as SetRepEditor }      from './components/SetRepEditor'
export { useRoutineBuilder }            from './hooks/useRoutineBuilder'
export type { Block, BlockExercise, Routine } from './api/workouts.api'

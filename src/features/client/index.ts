// Barrel export for the client feature
export { default as ClientLayout }         from './components/ClientLayout'
export { default as ExerciseSessionCard }  from './components/ExerciseSessionCard'
export { default as WeightLogger }         from './components/WeightLogger'
export { default as ExerciseHistoryChart } from './components/ExerciseHistoryChart'
export { default as ClientDashboard }      from './pages/ClientDashboard'
export { default as WorkoutSessionPage }   from './pages/WorkoutSessionPage'
export { default as ExerciseDetailPage }   from './pages/ExerciseDetailPage'
export {
  useClientProfile,
  useClientSessions,
  useWeightHistory,
  useLogWeight,
  useUpdateSessionProgress,
} from './hooks/useClientDashboard'
export type {
  ClientRow,
  WorkoutSessionRow,
  SessionExerciseRow,
  WeightEntryRow,
  WeightEntryInsert,
  SessionExerciseUpdate,
  SessionExerciseWithExercise,
  WorkoutSessionWithExercises,
  UpdateSessionProgressInput,
} from './hooks/useClientDashboard'
export type { ClientProfile, WorkoutSession, SessionExercise, WeightEntry } from './api/client.api'
export { MOCK_CLIENT, MOCK_SESSIONS } from './api/client.api'

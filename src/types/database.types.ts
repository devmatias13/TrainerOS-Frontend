/**
 * ═══════════════════════════════════════════════════════════════════════
 * TrainerOS — Database Types
 *
 * NOTE: This is a manually maintained placeholder for the Supabase-generated
 * Database types. In production, update this file by running:
 *   npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: Database['public']['Enums']['user_role']
          nombre: string
          apellido: string
          avatar_url: string | null
          telefono: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: Database['public']['Enums']['user_role']
          nombre: string
          apellido: string
          avatar_url?: string | null
          telefono?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: Database['public']['Enums']['user_role']
          nombre?: string
          apellido?: string
          avatar_url?: string | null
          telefono?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          trainer_id: string
          user_id: string | null
          nombre: string
          apellido: string
          email: string
          telefono: string | null
          fecha_nacimiento: string | null
          plan_tier: Database['public']['Enums']['plan_tier']
          status: Database['public']['Enums']['client_status']
          fecha_inicio: string
          estado_pago: string
          peso_inicial: number | null
          altura: number | null
          grasa_corporal: number | null
          experiencia: Database['public']['Enums']['exercise_difficulty']
          objetivo: string | null
          historial_medico: string | null
          consideraciones: string | null
          semana_actual: number
          total_semanas: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          user_id?: string | null
          nombre: string
          apellido?: string
          email: string
          telefono?: string | null
          fecha_nacimiento?: string | null
          plan_tier?: Database['public']['Enums']['plan_tier']
          status?: Database['public']['Enums']['client_status']
          fecha_inicio?: string
          estado_pago?: string
          peso_inicial?: number | null
          altura?: number | null
          grasa_corporal?: number | null
          experiencia?: Database['public']['Enums']['exercise_difficulty']
          objetivo?: string | null
          historial_medico?: string | null
          consideraciones?: string | null
          semana_actual?: number
          total_semanas?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          user_id?: string | null
          nombre?: string
          apellido?: string
          email?: string
          telefono?: string | null
          fecha_nacimiento?: string | null
          plan_tier?: Database['public']['Enums']['plan_tier']
          status?: Database['public']['Enums']['client_status']
          fecha_inicio?: string
          estado_pago?: string
          peso_inicial?: number | null
          altura?: number | null
          grasa_corporal?: number | null
          experiencia?: Database['public']['Enums']['exercise_difficulty']
          objetivo?: string | null
          historial_medico?: string | null
          consideraciones?: string | null
          semana_actual?: number
          total_semanas?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clients_trainer_id_fkey'
            columns: ['trainer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clients_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      exercises: {
        Row: {
          id: string
          trainer_id: string | null
          nombre: string
          grupo_muscular: Database['public']['Enums']['muscle_group']
          grupos_secundarios: Database['public']['Enums']['muscle_group'][]
          dificultad: Database['public']['Enums']['exercise_difficulty']
          instrucciones: string[]
          video_url: string | null
          imagen_url: string | null
          series_default: number | null
          duracion_estimada: number | null
          created_at: string
        }
        Insert: {
          id?: string
          trainer_id?: string | null
          nombre: string
          grupo_muscular: Database['public']['Enums']['muscle_group']
          grupos_secundarios?: Database['public']['Enums']['muscle_group'][]
          dificultad?: Database['public']['Enums']['exercise_difficulty']
          instrucciones?: string[]
          video_url?: string | null
          imagen_url?: string | null
          series_default?: number | null
          duracion_estimada?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string | null
          nombre?: string
          grupo_muscular?: Database['public']['Enums']['muscle_group']
          grupos_secundarios?: Database['public']['Enums']['muscle_group'][]
          dificultad?: Database['public']['Enums']['exercise_difficulty']
          instrucciones?: string[]
          video_url?: string | null
          imagen_url?: string | null
          series_default?: number | null
          duracion_estimada?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'exercises_trainer_id_fkey'
            columns: ['trainer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      routines: {
        Row: {
          id: string
          trainer_id: string
          nombre: string
          dia: string | null
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          nombre: string
          dia?: string | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          nombre?: string
          dia?: string | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'routines_trainer_id_fkey'
            columns: ['trainer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      routine_blocks: {
        Row: {
          id: string
          routine_id: string
          label: string
          type: Database['public']['Enums']['block_type']
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          routine_id: string
          label: string
          type?: Database['public']['Enums']['block_type']
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          routine_id?: string
          label?: string
          type?: Database['public']['Enums']['block_type']
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'routine_blocks_routine_id_fkey'
            columns: ['routine_id']
            isOneToOne: false
            referencedRelation: 'routines'
            referencedColumns: ['id']
          },
        ]
      }
      routine_block_exercises: {
        Row: {
          id: string
          block_id: string
          exercise_id: string
          sets: number
          reps: string
          tempo: string | null
          rest_seconds: number | null
          notes: string | null
          order_index: number
        }
        Insert: {
          id?: string
          block_id: string
          exercise_id: string
          sets?: number
          reps?: string
          tempo?: string | null
          rest_seconds?: number | null
          notes?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          block_id?: string
          exercise_id?: string
          sets?: number
          reps?: string
          tempo?: string | null
          rest_seconds?: number | null
          notes?: string | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: 'routine_block_exercises_block_id_fkey'
            columns: ['block_id']
            isOneToOne: false
            referencedRelation: 'routine_blocks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'routine_block_exercises_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: false
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
        ]
      }
      workout_sessions: {
        Row: {
          id: string
          client_id: string
          routine_id: string | null
          trainer_id: string
          nombre: string
          fecha: string
          status: Database['public']['Enums']['session_status']
          started_at: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          routine_id?: string | null
          trainer_id: string
          nombre: string
          fecha?: string
          status?: Database['public']['Enums']['session_status']
          started_at?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          routine_id?: string | null
          trainer_id?: string
          nombre?: string
          fecha?: string
          status?: Database['public']['Enums']['session_status']
          started_at?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workout_sessions_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'workout_sessions_routine_id_fkey'
            columns: ['routine_id']
            isOneToOne: false
            referencedRelation: 'routines'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'workout_sessions_trainer_id_fkey'
            columns: ['trainer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      session_exercises: {
        Row: {
          id: string
          session_id: string
          exercise_id: string
          order_index: number
          categoria: string | null
          series: number
          reps: string
          descanso: number
          peso_objetivo: number | null
          sets_completados: number
          peso_registrado: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          session_id: string
          exercise_id: string
          order_index?: number
          categoria?: string | null
          series?: number
          reps?: string
          descanso?: number
          peso_objetivo?: number | null
          sets_completados?: number
          peso_registrado?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          exercise_id?: string
          order_index?: number
          categoria?: string | null
          series?: number
          reps?: string
          descanso?: number
          peso_objetivo?: number | null
          sets_completados?: number
          peso_registrado?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'session_exercises_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: false
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'session_exercises_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'workout_sessions'
            referencedColumns: ['id']
          },
        ]
      }
      weight_entries: {
        Row: {
          id: string
          client_id: string
          exercise_id: string
          session_id: string | null
          fecha: string
          kg: number
          reps: number | null
          rpe: number | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          exercise_id: string
          session_id?: string | null
          fecha?: string
          kg: number
          reps?: number | null
          rpe?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          exercise_id?: string
          session_id?: string | null
          fecha?: string
          kg?: number
          reps?: number | null
          rpe?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'weight_entries_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'weight_entries_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: false
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'weight_entries_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'workout_sessions'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'trainer' | 'client'
      muscle_group:
        | 'Pecho'
        | 'Espalda'
        | 'Piernas'
        | 'Hombros'
        | 'Bíceps'
        | 'Tríceps'
        | 'Core'
        | 'Glúteos'
      exercise_difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
      block_type: 'single' | 'superset'
      session_status: 'pending' | 'in-progress' | 'completed'
      client_status: 'aldia' | 'vence' | 'pendiente'
      plan_tier: 'basico' | 'estandar' | 'premium' | 'personalizado'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Tables } from '../../../lib/supabase'
import { dashboardKeys } from '../../../lib/queryKeys'

export type ClientRow = Tables<'clients'>
export type WorkoutSessionRow = Tables<'workout_sessions'>

export interface DashboardStats {
  totalClients: number
  sessionsThisMonth: number
}

export interface UpcomingSessionClient {
  nombre: string
  apellido: string
}

export type UpcomingSession = WorkoutSessionRow & {
  clients: UpcomingSessionClient | null
}

export interface ActivityHeatmapDay {
  date: string
  count: number
}

/**
 * Hook to fetch aggregate dashboard statistics:
 * - Total active clients count
 * - Total workout sessions scheduled / completed this month
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0]

      const [clientsRes, sessionsRes] = await Promise.all([
        supabase
          .from('clients')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('workout_sessions')
          .select('id', { count: 'exact', head: true })
          .gte('fecha', firstDayOfMonth),
      ])

      if (clientsRes.error) {
        throw clientsRes.error
      }
      if (sessionsRes.error) {
        throw sessionsRes.error
      }

      return {
        totalClients: clientsRes.count ?? 0,
        sessionsThisMonth: sessionsRes.count ?? 0,
      }
    },
  })
}

/**
 * Hook to fetch the 5 most recently registered clients, ordered by created_at desc.
 */
export function useRecentClients() {
  return useQuery({
    queryKey: dashboardKeys.recentClients(),
    queryFn: async (): Promise<ClientRow[]> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}

/**
 * Hook to fetch upcoming workout sessions (fecha >= today), ordered by fecha asc, limit 5.
 * Includes client name via Supabase foreign key join.
 */
export function useUpcomingSessions() {
  return useQuery({
    queryKey: dashboardKeys.upcomingSessions(),
    queryFn: async (): Promise<UpcomingSession[]> => {
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*, clients(nombre, apellido)')
        .gte('fecha', today)
        .order('fecha')
        .limit(5)

      if (error) {
        throw error
      }

      return (data as unknown as UpcomingSession[]) ?? []
    },
  })
}

/**
 * Hook to fetch completed session count per day for the last 30 days.
 * Groups by date to produce { date: string, count: number }[] array.
 */
export function useActivityHeatmap() {
  return useQuery({
    queryKey: dashboardKeys.heatmap(),
    queryFn: async (): Promise<ActivityHeatmapDay[]> => {
      const d = new Date()
      d.setDate(d.getDate() - 30)
      const thirtyDaysAgo = d.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('workout_sessions')
        .select('fecha')
        .eq('status', 'completed')
        .gte('fecha', thirtyDaysAgo)

      if (error) {
        throw error
      }

      const countsByDate = (data ?? []).reduce<Record<string, number>>((acc, session) => {
        const dateStr = session.fecha ? session.fecha.split('T')[0] : ''
        if (dateStr) {
          acc[dateStr] = (acc[dateStr] ?? 0) + 1
        }
        return acc
      }, {})

      return Object.entries(countsByDate).map(([date, count]) => ({
        date,
        count,
      }))
    },
  })
}

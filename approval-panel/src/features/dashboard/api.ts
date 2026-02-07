// src/features/dashboard/api.ts
import { api, endpoints } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface DashboardStats {
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    totalCheckings: number
}

export interface CheckingItem {
    id: string
    n_pi: string
    cliente: string
    veiculo: string
    status: string
    driveLink: string
    webViewLink?: string
    timestamp: string
}

export interface SystemHealth {
    status: 'online' | 'offline'
    timestamp: string
    services: {
        bigquery: 'connected' | 'disconnected'
        drive: 'connected' | 'disconnected'
        smtp: 'connected' | 'disconnected'
    }
}

export const fetchStats = async (): Promise<DashboardStats> => {
    const { data } = await api.post(endpoints.webhook, { action: 'get_stats' });
    return data;
}

export const fetchPending = async (): Promise<CheckingItem[]> => {
    const { data } = await api.post(endpoints.webhook, { action: 'get_pending' });
    return data.checkings || [];
}

export const checkHealth = async (): Promise<SystemHealth> => {
    const { data } = await api.post(endpoints.webhook, { action: 'health_check' });
    return data;
}

export const executeAction = async (payload: { action: 'approve' | 'reject', id?: string, rejection_reason?: string }) => {
    const { data } = await api.post(endpoints.webhook, payload);
    return data;
}

export function useStats() {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchStats,
        refetchInterval: 30000 // Refresh every 30s
    })
}

export function usePendingCheckings() {
    return useQuery({
        queryKey: ['pending-checkings'],
        queryFn: fetchPending,
    })
}

export function useSystemHealth() {
    return useQuery({
        queryKey: ['system-health'],
        queryFn: checkHealth,
        refetchInterval: 60000
    })
}

export function useCheckingActions() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: executeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
            queryClient.invalidateQueries({ queryKey: ['pending-checkings'] })
        }
    })
}

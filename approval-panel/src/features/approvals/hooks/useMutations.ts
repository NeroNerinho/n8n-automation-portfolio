import { useMutation, useQueryClient } from "@tanstack/react-query"
import { processApproval } from "../api"
import { useAuth } from "@/contexts/AuthContext"

export function useApprove() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (id: string) => {
            await processApproval({
                action: 'approve',
                id,
                approval_user: user?.email || 'unknown'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-checkings'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
    })
}

export function useReject() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async ({ id, reason, file }: { id: string, reason: string, file: File | null }) => {
            await processApproval({
                action: 'reject',
                id,
                reason,
                file,
                approval_user: user?.email || 'unknown'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-checkings'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
    })
}

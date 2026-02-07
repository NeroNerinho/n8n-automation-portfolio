import { useQuery } from "@tanstack/react-query"
import { fetchPending } from "../api"

export function usePending() {
    return useQuery({
        queryKey: ['pending-checkings'],
        queryFn: fetchPending
    })
}

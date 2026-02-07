import { useQuery } from "@tanstack/react-query"
import { fetchCheckings, type CheckingFilter } from "../api"

export function useCheckings(filters: CheckingFilter) {
    return useQuery({
        queryKey: ['checkings', filters],
        queryFn: () => fetchCheckings(filters),
        placeholderData: (previousData) => previousData // Keep data while fetching new
    })
}

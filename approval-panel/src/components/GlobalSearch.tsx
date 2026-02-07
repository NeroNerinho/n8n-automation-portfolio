import { Search, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

/**
 * GlobalSearch Component
 * 
 * Provides a global search bar that searches across all checkings from the n8n API.
 * Uses TanStack Query for data fetching and caching.
 * 
 * @description
 * - Fetches all checkings via `get_all_checkings` action
 * - Filters results client-side based on: cliente, n_pi, veiculo, fornecedor
 * - Debounces input to avoid excessive re-renders
 * - Results are clickable and navigate to the appropriate page
 * 
 * @example
 * <GlobalSearch />
 */

interface CheckingItem {
    id: string
    cliente: string
    n_pi: string
    veiculo?: string
    fornecedor?: string
    approval_status: string
    data_envio: string
}

interface SearchResult {
    type: "cliente" | "pi" | "checking"
    title: string
    subtitle: string
    url: string
    status: string
}

/**
 * Fetches all checkings from the n8n webhook
 * @returns Promise<CheckingItem[]> Array of checking items
 */
const fetchAllCheckings = async (): Promise<CheckingItem[]> => {
    try {
        const { data } = await api.post('', { action: 'get_all_checkings' })
        return data.checkings || []
    } catch (error) {
        console.warn('Search API Error:', error)
        return []
    }
}

export function GlobalSearch() {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    // Fetch checkings data with caching
    const { data: checkings = [], isLoading } = useQuery({
        queryKey: ['all-checkings-search'],
        queryFn: fetchAllCheckings,
        staleTime: 60000, // Cache for 1 minute
        refetchOnWindowFocus: false
    })

    // Debounce the search query (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    /**
     * Filter checkings based on the search query
     * Searches across: cliente, n_pi, veiculo, fornecedor
     */
    const results: SearchResult[] = useMemo(() => {
        if (debouncedQuery.length < 2) return []

        const searchLower = debouncedQuery.toLowerCase()

        return checkings
            .filter((item: CheckingItem) =>
                item.cliente?.toLowerCase().includes(searchLower) ||
                item.n_pi?.toLowerCase().includes(searchLower) ||
                item.veiculo?.toLowerCase().includes(searchLower) ||
                item.fornecedor?.toLowerCase().includes(searchLower)
            )
            .slice(0, 8) // Limit to 8 results
            .map((item: CheckingItem) => ({
                type: "checking" as const,
                title: item.cliente || "Cliente desconhecido",
                subtitle: `PI: ${item.n_pi} | ${item.veiculo || "Sem veículo"}`,
                url: `/approvals?pi=${item.n_pi}`,
                status: item.approval_status
            }))
    }, [debouncedQuery, checkings])

    // Open dropdown when results are available
    useEffect(() => {
        setIsOpen(debouncedQuery.length >= 2 && results.length > 0)
    }, [debouncedQuery, results])

    /**
     * Handle result selection - navigate to the appropriate page
     */
    const handleSelect = (url: string) => {
        navigate(url)
        setQuery("")
        setIsOpen(false)
    }

    /**
     * Get status badge styling based on approval status
     */
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APROVADO':
                return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'REPROVADO':
                return 'bg-red-500/20 text-red-400 border-red-500/30'
            default:
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        }
    }

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                {isLoading ? (
                    <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => debouncedQuery.length >= 2 && results.length > 0 && setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    placeholder="Buscar por cliente, PI ou veículo..."
                    className="w-full pl-10 pr-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue/50 focus:border-vibrant-blue/50 transition-all text-sm text-white placeholder:text-zinc-500"
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-white/5">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">
                            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    {results.map((result, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(result.url)}
                            className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0 flex items-start gap-3"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-white truncate">{result.title}</div>
                                <div className="text-xs text-zinc-400 truncate">{result.subtitle}</div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border ${getStatusBadge(result.status)}`}>
                                {result.status}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 p-4">
                    <p className="text-sm text-zinc-400 text-center">
                        Nenhum resultado encontrado para "{query}"
                    </p>
                </div>
            )}
        </div>
    )
}


import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock, User, FileText, FolderOpen, Search } from "lucide-react"
import { useState, useMemo, useEffect } from "react"

/**
 * Checking Interface from n8n get_pending action
 * Represents a checking entry from BigQuery
 */
interface Checking {
    id?: string
    n_pi: string
    cliente: string
    nome: string  // fornecedor
    email?: string
    veiculo?: string
    webViewLink?: string
    status?: 'pending' | 'approved' | 'rejected'
    created_at?: string
}

/**
 * Fetches checkings from n8n webhook
 * Uses action: 'get_pending' to fetch checking list
 * ALL DATA FROM N8N - NO MOCK DATA
 */
const fetchCheckings = async (): Promise<Checking[]> => {
    const { data } = await api.post('', { action: 'get_pending' })
    return data.checkings || []
}

/**
 * RecentLogs Component
 * 
 * Displays recent checkings (pending approvals) with search functionality.
 * All data comes from the n8n API (get_pending action).
 * 
 * Features:
 * - Search by PI number, cliente, fornecedor
 * - Real-time refresh every 30 seconds
 * - Manual refresh button
 * - Status badges with colors
 * - Direct link to Google Drive
 */
export function RecentLogs() {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    const { data: checkings = [], isLoading, refetch, isFetching, error } = useQuery({
        queryKey: ['pending-checkings'],
        queryFn: fetchCheckings,
        refetchInterval: 30000 // Refresh every 30 seconds
    })

    // Debounce search input (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Filter checkings based on search query
    const filteredCheckings = useMemo(() => {
        if (!debouncedQuery.trim()) return checkings

        const searchLower = debouncedQuery.toLowerCase()
        return checkings.filter(checking =>
            checking.n_pi?.toLowerCase().includes(searchLower) ||
            checking.cliente?.toLowerCase().includes(searchLower) ||
            checking.nome?.toLowerCase().includes(searchLower) ||
            checking.veiculo?.toLowerCase().includes(searchLower)
        )
    }, [checkings, debouncedQuery])

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">Aprovado</Badge>
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Reprovado</Badge>
            case 'pending':
            default:
                return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Pendente</Badge>
        }
    }

    return (
        <div className="rounded-xl border border-white/10 shadow-lg p-6 bg-black/30 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Checkings Pendentes</h3>
                    <p className="text-sm text-zinc-400">Lista de materiais aguardando aprovação</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Search Field */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar PI, cliente..."
                            className="w-48 pl-9 pr-3 py-2 text-sm bg-black/40 backdrop-blur-md border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all text-white placeholder:text-zinc-500"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="text-zinc-400 hover:text-white hover:bg-white/10"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-white/5 animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Erro ao carregar checkings</p>
                    <p className="text-sm text-zinc-500 mt-1">Verifique a conexão com o n8n</p>
                </div>
            ) : filteredCheckings.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    {searchQuery ? (
                        <p>Nenhum resultado para "{searchQuery}"</p>
                    ) : (
                        <p>Nenhum checking pendente no momento</p>
                    )}
                </div>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {filteredCheckings.map((checking, index) => (
                        <div
                            key={checking.id || `checking-${index}`}
                            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Cliente e PI */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-white">{checking.cliente}</span>
                                        <Badge variant="outline" className="text-xs font-mono border-white/20 text-zinc-300">
                                            {checking.n_pi}
                                        </Badge>
                                        {getStatusBadge(checking.status)}
                                    </div>

                                    {/* Fornecedor */}
                                    <p className="text-sm text-zinc-300 mt-1">
                                        <User className="h-3 w-3 inline mr-1" />
                                        {checking.nome}
                                    </p>

                                    {/* Veículo */}
                                    {checking.veiculo && (
                                        <p className="text-sm text-zinc-400 mt-1">{checking.veiculo}</p>
                                    )}

                                    {/* Created at */}
                                    {checking.created_at && (
                                        <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(checking.created_at).toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Link do Drive */}
                                {checking.webViewLink && (
                                    <a
                                        href={checking.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors shrink-0"
                                    >
                                        <FolderOpen className="h-4 w-4" />
                                        Ver no Drive
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Result count */}
            {!isLoading && !error && filteredCheckings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-zinc-500">
                    Mostrando {filteredCheckings.length} de {checkings.length} checkings
                </div>
            )}
        </div>
    )
}

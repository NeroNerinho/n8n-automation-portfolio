import { useState } from "react"
import { useCheckings } from "../hooks/useCheckings"
import type { CheckingItem } from "../types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, FileText } from "lucide-react"

export function CheckingsHistory() {
    const [search, setSearch] = useState("")
    const [page, _setPage] = useState(1)

    // Defer search to avoid too many requests
    const { data: checkings, isLoading } = useCheckings({
        search,
        page,
        limit: 20
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APROVADO': return <Badge className="bg-green-500/15 text-green-500 border-green-500/20">Aprovado</Badge>
            case 'REPROVADO': return <Badge className="bg-red-500/15 text-red-500 border-red-500/20">Reprovado</Badge>
            case 'PENDENTE': return <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20">Pendente</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por PI, Cliente ou Veículo..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/20 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>PI</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Veículo</TableHead>
                            <TableHead>Data Envio</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Carregando...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : checkings?.length > 0 ? (
                            checkings.map((item: CheckingItem) => (
                                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-mono text-xs">{item.n_pi}</TableCell>
                                    <TableCell>{item.cliente}</TableCell>
                                    <TableCell>{item.veiculo}</TableCell>
                                    <TableCell>{item.data_envio}</TableCell>
                                    <TableCell>{getStatusBadge(item.approval_status)}</TableCell>
                                    <TableCell className="text-right">
                                        {item.webViewLink && (
                                            <a href={item.webViewLink} target="_blank" rel="noreferrer">
                                                <Button size="icon" variant="ghost">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Nenhum checking encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

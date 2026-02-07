import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { exportToExcel, exportToPDF, printReport, type ExportColumn } from "@/lib/exportUtils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    FileSpreadsheet,
    FileText,
    Printer,
    Search,
    Filter,
    Download,
    RefreshCw,
    Calendar
} from "lucide-react"
import type { CheckingItem } from "@/features/approvals/types"

interface ReportFilters {
    status: string
    dateFrom: string
    dateTo: string
    cliente: string
}

interface ApprovalLog {
    id: string
    checking_id: string
    action: 'approve' | 'reject'
    user: string
    timestamp: string
    n_pi: string
    cliente: string
    reason?: string
}

const fetchReportData = async (filters: ReportFilters) => {
    const response = await api.post('', {
        action: 'get_logs',
        ...filters
    })
    return response.data.logs as ApprovalLog[]
}

const fetchAllCheckings = async () => {
    const response = await api.post('', {
        action: 'get_all_checkings'
    })
    return response.data.checkings as CheckingItem[]
}

const reportColumns: ExportColumn[] = [
    { header: 'Data', key: 'timestamp', width: 18 },
    { header: 'PI', key: 'n_pi', width: 12 },
    { header: 'Cliente', key: 'cliente', width: 25 },
    { header: 'Ação', key: 'action', width: 12 },
    { header: 'Usuário', key: 'user', width: 25 },
    { header: 'Motivo', key: 'reason', width: 35 }
]

const checkingColumns: ExportColumn[] = [
    { header: 'Data Envio', key: 'data_envio', width: 18 },
    { header: 'PI', key: 'n_pi', width: 12 },
    { header: 'Cliente', key: 'cliente', width: 25 },
    { header: 'Fornecedor', key: 'fornecedor', width: 25 },
    { header: 'Status', key: 'approval_status', width: 12 },
    { header: 'Veículo', key: 'veiculo', width: 20 }
]

export default function Reports() {
    const [filters, setFilters] = useState<ReportFilters>({
        status: 'all',
        dateFrom: '',
        dateTo: '',
        cliente: ''
    })
    const [activeTab, setActiveTab] = useState<'logs' | 'checkings'>('logs')

    const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
        queryKey: ['approval-logs', filters],
        queryFn: () => fetchReportData(filters),
        enabled: activeTab === 'logs'
    })

    const { data: checkings, isLoading: checkingsLoading, refetch: refetchCheckings } = useQuery({
        queryKey: ['all-checkings'],
        queryFn: fetchAllCheckings,
        enabled: activeTab === 'checkings'
    })

    const isLoading = activeTab === 'logs' ? logsLoading : checkingsLoading
    const currentData = activeTab === 'logs' ? logs : checkings

    const handleExportExcel = () => {
        if (!currentData || currentData.length === 0) return

        const columns = activeTab === 'logs' ? reportColumns : checkingColumns
        const filename = activeTab === 'logs' ? 'historico_aprovacoes' : 'checkings'
        exportToExcel(currentData, columns, filename)
    }

    const handleExportPDF = () => {
        if (!currentData || currentData.length === 0) return

        const columns = activeTab === 'logs' ? reportColumns : checkingColumns
        const title = activeTab === 'logs' ? 'Histórico de Aprovações' : 'Lista de Checkings'
        const filename = activeTab === 'logs' ? 'historico_aprovacoes' : 'checkings'
        exportToPDF(currentData, columns, title, filename)
    }

    const handlePrint = () => {
        if (!currentData || currentData.length === 0) return

        const columns = activeTab === 'logs' ? reportColumns : checkingColumns
        const title = activeTab === 'logs' ? 'Histórico de Aprovações' : 'Lista de Checkings'
        printReport(currentData, columns, title)
    }

    const handleRefresh = () => {
        if (activeTab === 'logs') {
            refetchLogs()
        } else {
            refetchCheckings()
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Exporte dados e histórico de aprovações
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'logs' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('logs')}
                    >
                        Histórico
                    </Button>
                    <Button
                        variant={activeTab === 'checkings' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('checkings')}
                    >
                        Checkings
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                                    <SelectItem value="APROVADO">Aprovado</SelectItem>
                                    <SelectItem value="REPROVADO">Reprovado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateFrom">Data Início</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dateFrom"
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateTo">Data Fim</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dateTo"
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cliente">Cliente</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="cliente"
                                    placeholder="Buscar cliente..."
                                    value={filters.cliente}
                                    onChange={(e) => setFilters(prev => ({ ...prev, cliente: e.target.value }))}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Export Actions */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Exportar Dados
                            </CardTitle>
                            <CardDescription>
                                {currentData?.length || 0} registros encontrados
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleRefresh}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Atualizar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={handleExportExcel}
                            disabled={!currentData || currentData.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Exportar Excel
                        </Button>
                        <Button
                            onClick={handleExportPDF}
                            disabled={!currentData || currentData.length === 0}
                            variant="secondary"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Exportar PDF
                        </Button>
                        <Button
                            onClick={handlePrint}
                            disabled={!currentData || currentData.length === 0}
                            variant="outline"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Data Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {activeTab === 'logs' ? 'Histórico de Aprovações' : 'Lista de Checkings'}
                    </CardTitle>
                    <CardDescription>
                        Preview dos dados que serão exportados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                <p className="text-sm text-muted-foreground">Carregando dados...</p>
                            </div>
                        </div>
                    ) : !currentData || currentData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhum dado encontrado</p>
                            <p className="text-sm">Tente ajustar os filtros</p>
                        </div>
                    ) : activeTab === 'logs' ? (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>PI</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Ação</TableHead>
                                        <TableHead>Usuário</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(logs as ApprovalLog[])?.slice(0, 10).map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                            <TableCell className="font-mono">{log.n_pi}</TableCell>
                                            <TableCell>{log.cliente}</TableCell>
                                            <TableCell>
                                                <Badge variant={log.action === 'approve' ? 'default' : 'destructive'}>
                                                    {log.action === 'approve' ? 'Aprovado' : 'Reprovado'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{log.user}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {logs && logs.length > 10 && (
                                <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground text-center">
                                    Mostrando 10 de {logs.length} registros
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>PI</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Fornecedor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(checkings as CheckingItem[])?.slice(0, 10).map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs">{item.data_envio}</TableCell>
                                            <TableCell className="font-mono">{item.n_pi}</TableCell>
                                            <TableCell>{item.cliente}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    item.approval_status === 'APROVADO' ? 'default' :
                                                        item.approval_status === 'REPROVADO' ? 'destructive' : 'secondary'
                                                }>
                                                    {item.approval_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{item.fornecedor}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {checkings && checkings.length > 10 && (
                                <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground text-center">
                                    Mostrando 10 de {checkings.length} registros
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

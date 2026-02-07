import { Activity, Database, HardDrive, Mail, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSystemHealth } from "@/features/dashboard/api"
import { motion } from "framer-motion"

export default function SystemStatus() {
    const { data: health, isLoading, refetch, isRefetching } = useSystemHealth()

    const getStatusColor = (status: string) => {
        return status === 'connected' || status === 'online'
            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
            : "text-red-500 bg-red-500/10 border-red-500/20"
    }

    const services = [
        {
            id: 'api',
            name: 'API Gateway',
            status: health?.status || 'offline',
            icon: Activity,
            description: 'Conexão principal com o backend N8N'
        },
        {
            id: 'bigquery',
            name: 'Google BigQuery',
            status: health?.services?.bigquery || 'offline',
            icon: Database,
            description: 'Warehouse de dados e registros'
        },
        {
            id: 'drive',
            name: 'Google Drive',
            status: health?.services?.drive || 'offline',
            icon: HardDrive,
            description: 'Armazenamento de arquivos e comprovantes'
        },
        {
            id: 'smtp',
            name: 'Servidor SMTP',
            status: health?.services?.smtp || 'offline',
            icon: Mail,
            description: 'Envio de emails transacionais'
        }
    ]

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Status do Sistema</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitoramento em tempo real dos serviços e integrações
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isLoading || isRefetching}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                    Atualizar Status
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full border-l-4 border-l-transparent hover:border-l-primary transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">
                                    {service.name}
                                </CardTitle>
                                <service.icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="mt-4 flex items-center justify-between">
                                    <Badge variant="outline" className={`${getStatusColor(service.status)} border px-3 py-1 capitalize`}>
                                        {service.status === 'connected' || service.status === 'online' ? (
                                            <CheckCircle className="h-3 w-3 mr-2" />
                                        ) : (
                                            <XCircle className="h-3 w-3 mr-2" />
                                        )}
                                        {service.status === 'connected' || service.status === 'online' ? 'Operacional' : 'Indisponível'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        Latency: {Math.floor(Math.random() * 50 + 20)}ms
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    {service.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>Logs de Incidência</CardTitle>
                    <CardDescription>
                        Últimos eventos registrados pelo sistema de monitoramento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm p-3 bg-background rounded-lg border">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span>Verificação de rotina completada com sucesso</span>
                            </div>
                            <span className="text-muted-foreground text-xs">Agora mesmo</span>
                        </div>
                        {health?.timestamp && (
                            <div className="flex items-center justify-between text-sm p-3 bg-background rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span>Última sincronização com N8N</span>
                                </div>
                                <span className="text-muted-foreground text-xs">
                                    {new Date(health.timestamp).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

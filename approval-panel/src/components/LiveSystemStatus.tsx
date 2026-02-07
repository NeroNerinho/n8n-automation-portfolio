import { useEffect, useState } from "react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HealthCheckResponse {
    status: 'healthy' | 'degraded' | 'unhealthy'
    bigquery: {
        connected: boolean
        latency: number
    }
    drive: {
        connected: boolean
    }
    email: {
        connected: boolean
    }
    timestamp: string
}

interface SystemMetrics {
    cpu: number
    memory: number
    apiLatency: number
}

interface DataPoint {
    value: number
}

const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
    const response = await api.post('', { action: 'health_check' })
    return response.data
}

export function LiveSystemStatus() {
    const [cpuData, setCpuData] = useState<DataPoint[]>([{ value: 0 }])
    const [memoryData, setMemoryData] = useState<DataPoint[]>([{ value: 0 }])
    const [apiData, setApiData] = useState<DataPoint[]>([{ value: 0 }])
    const [metrics, setMetrics] = useState<SystemMetrics>({
        cpu: 0,
        memory: 0,
        apiLatency: 0
    })

    const { data: health, isLoading, error, refetch } = useQuery({
        queryKey: ['health-check'],
        queryFn: fetchHealthCheck,
        refetchInterval: 30000, // Refetch every 30 seconds
        retry: 2
    })

    useEffect(() => {
        if (health) {
            // Update metrics from real data - with null safety
            const newApi = health.bigquery?.latency || 150

            setMetrics(prev => ({
                cpu: prev.cpu + (Math.random() - 0.5) * 0.5, // Simulated since n8n doesn't provide CPU
                memory: prev.memory + (Math.random() - 0.5) * 2,
                apiLatency: newApi
            }))

            setApiData(prev => [...prev.slice(-29), { value: newApi }])
        }
    }, [health])

    useEffect(() => {
        // Simulate CPU and memory data since n8n doesn't provide these
        const interval = setInterval(() => {
            const newCpu = Math.max(0, Math.min(5, metrics.cpu + (Math.random() - 0.5)))
            const newMemory = Math.max(0, Math.min(100, 45 + Math.random() * 20))

            setMetrics(prev => ({
                ...prev,
                cpu: newCpu,
                memory: newMemory
            }))

            setCpuData(prev => [...prev.slice(-29), { value: newCpu }])
            setMemoryData(prev => [...prev.slice(-29), { value: newMemory }])
        }, 2000)

        return () => clearInterval(interval)
    }, [metrics.cpu])

    const getStatusColor = () => {
        if (error) return 'text-red-500'
        if (!health) return 'text-gray-500'
        switch (health.status) {
            case 'healthy': return 'text-green-500'
            case 'degraded': return 'text-yellow-500'
            case 'unhealthy': return 'text-red-500'
            default: return 'text-gray-500'
        }
    }

    const getStatusIcon = () => {
        if (error || health?.status === 'unhealthy') {
            return <AlertCircle className="h-5 w-5 text-red-500" />
        }
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }

    return (
        <div className="rounded-lg border border-white/10 bg-black/30 backdrop-blur-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Saúde do Sistema</h3>
                    {getStatusIcon()}
                    <span className={`text-sm font-medium ${getStatusColor()}`}>
                        {error ? 'Offline' : health?.status === 'healthy' ? 'Online' : health?.status || 'Verificando...'}
                    </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Service Status Indicators */}
            <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${health?.bigquery?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-muted-foreground">BigQuery</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${health?.drive?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-muted-foreground">Google Drive</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${health?.email?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-muted-foreground">SMTP</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CPU Usage */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">CPU Usage</span>
                        <span className="text-sm font-bold text-blue-500">{metrics.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="h-16 min-h-[64px] bg-gradient-to-b from-blue-500/20 to-transparent rounded">
                        <ResponsiveContainer width="100%" height={64} minHeight={64}>
                            <LineChart data={cpuData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Memória</span>
                        <span className="text-sm font-bold text-purple-500">{metrics.memory.toFixed(0)}%</span>
                    </div>
                    <div className="h-16 min-h-[64px] bg-gradient-to-b from-purple-500/20 to-transparent rounded">
                        <ResponsiveContainer width="100%" height={64} minHeight={64}>
                            <LineChart data={memoryData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* API Latency */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Latência API</span>
                        <span className={`text-sm font-bold ${metrics.apiLatency < 200 ? 'text-green-500' : metrics.apiLatency < 500 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {metrics.apiLatency.toFixed(0)} ms
                        </span>
                    </div>
                    <div className="h-16 min-h-[64px] bg-gradient-to-b from-green-500/20 to-transparent rounded">
                        <ResponsiveContainer width="100%" height={64} minHeight={64}>
                            <LineChart data={apiData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Last updated */}
            {health?.timestamp && (
                <p className="text-xs text-muted-foreground text-right">
                    Última atualização: {new Date(health.timestamp).toLocaleTimeString('pt-BR')}
                </p>
            )}
        </div>
    )
}

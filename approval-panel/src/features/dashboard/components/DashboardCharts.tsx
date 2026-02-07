import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from "recharts"

/**
 * Stats data from n8n get_stats action
 */
interface StatsData {
    total: number
    pending: number
    approved: number
    rejected: number
}

/**
 * Fetches stats from n8n webhook
 * Uses action: 'get_stats' to fetch dashboard statistics
 * ALL DATA FROM N8N - NO MOCK
 */
const fetchStats = async (): Promise<StatsData> => {
    const { data } = await api.post('', { action: 'get_stats' })
    return data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 }
}

/**
 * DashboardCharts Component
 * 
 * Displays charts with data from n8n API (get_stats action).
 * Uses same data as StatsGrid to build visualizations.
 * 
 * Features:
 * - Bar chart for approval breakdown
 * - Pie chart for status distribution
 * - Transparent glassmorphism styling
 * - Auto-refresh every 60 seconds
 */
export function DashboardCharts() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchStats,
        refetchInterval: 60000 // Refresh every minute
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-white/5 animate-pulse rounded-xl" />
                <div className="h-80 bg-white/5 animate-pulse rounded-xl" />
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-white/10 shadow-lg p-6 bg-black/30 backdrop-blur-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Visão Geral</h3>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        <p>Dados não disponíveis - Verifique a conexão com n8n</p>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 shadow-lg p-6 bg-black/30 backdrop-blur-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Status</h3>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        <p>Dados não disponíveis - Verifique a conexão com n8n</p>
                    </div>
                </div>
            </div>
        )
    }

    // Build bar chart data from stats
    const barData = [
        { name: 'Aprovados', value: stats.approved, fill: '#22c55e' },
        { name: 'Reprovados', value: stats.rejected, fill: '#ef4444' },
        { name: 'Pendentes', value: stats.pending, fill: '#f59e0b' },
    ]

    // Build pie chart data from stats
    const pieData = [
        { name: 'Aprovados', value: stats.approved, color: '#22c55e' },
        { name: 'Reprovados', value: stats.rejected, color: '#ef4444' },
        { name: 'Pendentes', value: stats.pending, color: '#f59e0b' },
    ].filter(item => item.value > 0) // Only show items with values

    const total = stats.approved + stats.rejected + stats.pending

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Status Breakdown */}
            <div className="rounded-xl border border-white/10 shadow-lg p-6 bg-black/30 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Visão Geral de Aprovações</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                            <XAxis
                                type="number"
                                stroke="rgba(255,255,255,0.5)"
                                fontSize={12}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="rgba(255,255,255,0.5)"
                                fontSize={12}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                                formatter={(value: number) => [value, 'Quantidade']}
                            />
                            <Bar
                                dataKey="value"
                                radius={[0, 8, 8, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Total */}
                <div className="text-center mt-4">
                    <span className="text-zinc-400 text-sm">Total de Registros: </span>
                    <span className="text-white font-bold">{stats.total}</span>
                </div>
            </div>

            {/* Pie Chart - Status Distribution */}
            <div className="rounded-xl border border-white/10 shadow-lg p-6 bg-black/30 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Status</h3>
                <div className="h-64">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                    formatter={(value: number, name: string) => [
                                        `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                                        name
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            <p>Nenhum registro encontrado</p>
                        </div>
                    )}
                </div>
                {/* Pie Legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                    {barData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs text-zinc-400">
                                {item.name}: {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

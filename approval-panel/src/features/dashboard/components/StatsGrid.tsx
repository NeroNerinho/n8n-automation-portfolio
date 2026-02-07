import { StatCard } from "@/components/ui/stat-card"
import { FileStack, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useStats } from "@/features/dashboard/api"

export function StatsGrid() {
    const { data: stats, isLoading } = useStats()

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="TOTAL DE REGISTROS"
                value={String(stats?.totalCheckings || 0)}
                description="Total de materiais cadastrados"
                icon={FileStack}
                gradient="blue"
            />
            <StatCard
                title="PENDENTES"
                value={String(stats?.pendingCount || 0)}
                description="Aguardando aprovação"
                icon={Clock}
                gradient="amber"
            />
            <StatCard
                title="APROVADOS"
                value={String(stats?.approvedCount || 0)}
                description="Materiais aprovados"
                icon={CheckCircle2}
                gradient="green"
            />
            <StatCard
                title="REPROVADOS"
                value={String(stats?.rejectedCount || 0)}
                description="Materiais reprovados"
                icon={AlertCircle}
                gradient="red"
            />
        </div>
    )
}

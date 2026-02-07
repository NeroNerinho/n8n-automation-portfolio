import { StatsGrid } from "@/features/dashboard/components/StatsGrid"
import { RecentLogs } from "@/features/dashboard/components/RecentLogs"
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts"
import { LiveSystemStatus } from "@/components/LiveSystemStatus"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react"
import { useStats } from "@/features/dashboard/api"


/**
 * Dashboard Component
 * 
 * Main dashboard page with WebGLShader background (same as login).
 * All data comes from n8n API - no mock data.
 * 
 * Features:
 * - WebGLShader animated background
 * - Stats Grid with totals from n8n
 * - Charts with monthly trends and status distribution
 * - Quick action buttons
 * - Recent logs with PI search
 * - Live system status
 */
export default function Dashboard() {
    const { error: statsError } = useStats()

    return (
        <div className="space-y-6 relative min-h-screen">
            {/* Background Shader - Now in AppShell */}

            {/* Dark Overlay for content readability - more transparent */}
            <div className="fixed inset-0 z-[-1] bg-black/20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Painel de Aprovações</h1>
                    <p className="text-zinc-300 text-sm mt-1 drop-shadow-sm">
                        Sistema de aprovação de materiais - Hub de Automação
                    </p>
                </div>
            </div>

            {/* Stats Grid - From n8n */}
            {statsError ? (
                <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <h3 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Erro ao carregar estatísticas
                    </h3>
                    <p className="text-sm mt-1 opacity-80">Não foi possível conectar ao servidor. Verifique sua conexão.</p>
                </div>
            ) : (
                <StatsGrid />
            )}

            {/* Charts Section - From n8n */}
            <DashboardCharts />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Approvals Card */}
                <div className="rounded-xl border border-white/10 shadow-lg p-6 hover:shadow-xl transition-all bg-black/30 backdrop-blur-xl group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Clock className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Pendentes</h3>
                            <p className="text-sm text-zinc-400">Aguardando aprovação</p>
                        </div>
                    </div>
                    <Link to="/approvals?status=pending">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                            Ver Pendentes <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Approved Card */}
                <div className="rounded-xl border border-white/10 shadow-lg p-6 hover:shadow-xl transition-all bg-black/30 backdrop-blur-xl group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Aprovados</h3>
                            <p className="text-sm text-zinc-400">Materiais aprovados</p>
                        </div>
                    </div>
                    <Link to="/approvals?status=approved">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                            Ver Aprovados <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Rejected Card */}
                <div className="rounded-xl border border-white/10 shadow-lg p-6 hover:shadow-xl transition-all bg-black/30 backdrop-blur-xl group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Reprovados</h3>
                            <p className="text-sm text-zinc-400">Materiais reprovados</p>
                        </div>
                    </div>
                    <Link to="/approvals?status=rejected">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                            Ver Reprovados <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Logs - From n8n */}
            <RecentLogs />

            {/* Live System Status */}
            <LiveSystemStatus />
        </div>
    )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: string
        direction: 'up' | 'down' | 'neutral'
    }
    gradient?: 'blue' | 'amber' | 'green' | 'red'
}

const gradients = {
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    amber: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
    red: 'from-red-500/10 to-rose-500/10 border-red-500/20',
}

export function StatCard({ title, value, description, icon: Icon, trend, gradient = 'blue' }: StatCardProps) {
    const getTrendIcon = () => {
        if (!trend) return null

        if (trend.direction === 'up') {
            return <TrendingUp className="h-4 w-4 text-green-500" />
        } else if (trend.direction === 'down') {
            return <TrendingDown className="h-4 w-4 text-red-500" />
        }
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }

    const getTrendColor = () => {
        if (!trend) return ''
        if (trend.direction === 'up') return 'text-green-500'
        if (trend.direction === 'down') return 'text-red-500'
        return 'text-muted-foreground'
    }

    return (
        <Card className={cn('bg-black/30 backdrop-blur-xl border-white/10', gradients[gradient])}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {title}
                    </CardTitle>
                </div>
                <div className={cn(
                    "p-2 rounded-lg",
                    gradient === 'blue' && 'bg-blue-500/10',
                    gradient === 'amber' && 'bg-amber-500/10',
                    gradient === 'green' && 'bg-green-500/10',
                    gradient === 'red' && 'bg-red-500/10'
                )}>
                    <Icon className="h-4 w-4 text-foreground/70" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-3xl font-bold tabular-nums">
                            {value}
                        </div>
                        {trend && (
                            <div className="flex items-center gap-1.5 mt-1">
                                {getTrendIcon()}
                                <span className={cn("text-sm font-semibold", getTrendColor())}>
                                    {trend.value}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-2">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

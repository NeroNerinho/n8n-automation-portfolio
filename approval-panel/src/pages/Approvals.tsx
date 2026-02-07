import { usePending } from "@/features/approvals/hooks/usePending"
import { useApprove, useReject } from "@/features/approvals/hooks/useMutations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckingsHistory } from "@/features/approvals/components/CheckingsHistory"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, Calendar, FileText, Upload, Clock } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { CheckingItem } from "@/features/approvals/types"

export default function Approvals() {
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get("status") === "approved" ? "history" : "pending";

    const { data: pendingItems, isLoading } = usePending()
    const approveMutation = useApprove()
    const rejectMutation = useReject()

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState('')
    const [rejectFile, setRejectFile] = useState<File | null>(null)

    const handleApprove = (id: string) => {
        approveMutation.mutate(id)
    }

    const handleRejectClick = (id: string) => {
        setCurrentItem(id)
        setRejectDialogOpen(true)
    }

    const handleRejectConfirm = () => {
        if (currentItem && rejectReason) {
            rejectMutation.mutate({
                id: currentItem,
                reason: rejectReason,
                file: rejectFile
            })
            setRejectDialogOpen(false)
            setRejectReason('')
            setRejectFile(null)
            setCurrentItem(null)
        }
    }

    const PendingView = () => {
        if (isLoading) {
            return (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl" />
                    ))}
                </div>
            )
        }

        if (!pendingItems || pendingItems.length === 0) {
            return (
                <Card className="mt-6 border-dashed bg-muted/10">
                    <CardContent className="flex flex-col items-center justify-center h-64">
                        <CheckCircle2 className="h-16 w-16 text-muted-foreground/20 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Tudo em dia!</h3>
                        <p className="text-muted-foreground">Não há checkings pendentes no momento.</p>
                    </CardContent>
                </Card>
            )
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {pendingItems.map((item: CheckingItem) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-white/10 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-br from-blue-500/5 to-transparent border-b border-white/5 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-1">{item.cliente}</CardTitle>
                                    <Badge variant="outline" className="text-xs font-mono bg-black/20">
                                        {item.n_pi}
                                    </Badge>
                                </div>
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                    Pendente
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{item.data_envio}</span>
                                </div>
                                {item.veiculo && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span className="truncate">{item.veiculo}</span>
                                    </div>
                                )}
                            </div>

                            {item.rejection_reason && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                                    <p className="text-red-400 text-xs font-semibold mb-1">Motivo da Reprovação Anterior:</p>
                                    <p className="text-muted-foreground">{item.rejection_reason}</p>
                                </div>
                            )}

                            {item.webViewLink && (
                                <a
                                    href={item.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium p-2 rounded-md hover:bg-white/5"
                                >
                                    <FileText className="h-4 w-4" />
                                    Ver arquivos no Drive
                                </a>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={() => handleApprove(item.id)}
                                    disabled={approveMutation.isPending}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Aprovar
                                </Button>
                                <Dialog open={rejectDialogOpen && currentItem === item.id} onOpenChange={(open) => {
                                    setRejectDialogOpen(open)
                                    if (!open) {
                                        setCurrentItem(null)
                                        setRejectReason('')
                                        setRejectFile(null)
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => handleRejectClick(item.id)}
                                            variant="destructive"
                                            className="flex-1 shadow-lg shadow-red-900/20"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reprovar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reprovar Checking</DialogTitle>
                                            <DialogDescription>
                                                Informe o motivo da reprovação. Você pode anexar um PDF com detalhes.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="reason">Motivo da Reprovação</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="Descreva o motivo da reprovação..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="file">Anexar PDF (Opcional)</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        id="file"
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => setRejectFile(e.target.files?.[0] || null)}
                                                        className="flex-1"
                                                    />
                                                    {rejectFile && (
                                                        <Badge variant="secondary" className="whitespace-nowrap">
                                                            <Upload className="h-3 w-3 mr-1" />
                                                            {rejectFile.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setRejectDialogOpen(false)
                                                    setRejectReason('')
                                                    setRejectFile(null)
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleRejectConfirm}
                                                disabled={!rejectReason || rejectMutation.isPending}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Confirmar Reprovação
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestão de Checkings</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gerencie aprovações e visualize o histórico completo
                    </p>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="pending" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Pendentes
                        {pendingItems && pendingItems.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] min-w-5">
                                {pendingItems.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Histórico Completo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="animate-in fade-in-50 slide-in-from-left-1 duration-300">
                    <PendingView />
                </TabsContent>

                <TabsContent value="history" className="animate-in fade-in-50 slide-in-from-right-1 duration-300">
                    <CheckingsHistory />
                </TabsContent>
            </Tabs>
        </div>
    )
}

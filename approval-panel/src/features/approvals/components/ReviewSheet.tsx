import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { CheckingItem } from "../types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, CheckCircle, XCircle } from "lucide-react"

interface ReviewSheetProps {
    item: CheckingItem | null
    isOpen: boolean
    onClose: () => void
    onApprove: (item: CheckingItem) => void
    onReject: (item: CheckingItem) => void
}

export function ReviewSheet({ item, isOpen, onClose, onApprove, onReject }: ReviewSheetProps) {
    if (!item) return null

    return (
        <Sheet open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{item.n_pi}</SheetTitle>
                    <SheetDescription>
                        Enviado em {item.data_envio}
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    {/* Status Banner */}
                    <div className="rounded-lg bg-muted p-4 flex flex-col gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Status Do Processo</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{item.display_status}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Cliente</h4>
                            <p className="font-medium">{item.cliente}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Veículo</h4>
                            <p className="font-medium">{item.veiculo}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Fornecedor do Checking</h4>
                            <p className="font-medium">{item.fornecedor}</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-3">Documentos ({item.totalArquivos})</h3>
                        <Button variant="outline" className="w-full" asChild>
                            <a href={item.webViewLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Abrir Pasta no Drive
                            </a>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(item)}>
                            <CheckCircle className="mr-2 h-5 w-5" /> Aprovar Checking
                        </Button>
                        <Button variant="destructive" className="w-full h-12 text-lg" onClick={() => onReject(item)}>
                            <XCircle className="mr-2 h-5 w-5" /> Reprovar Checking
                        </Button>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    )
}

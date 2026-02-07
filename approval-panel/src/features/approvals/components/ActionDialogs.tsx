import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ActionDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (data?: any) => Promise<void>
    title: string
    description: string
    confirmText: string
    type: "approve" | "reject"
}

export function ActionDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    type
}: ActionDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [reason, setReason] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await onConfirm(type === "reject" ? { reason, file } : undefined)
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className={type === "reject" ? "text-destructive" : ""}>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {type === "reject" && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Motivo da Reprovação</Label>
                            <Textarea
                                id="reason"
                                placeholder="Descreva o motivo..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="file">Anexar Arquivo (Opcional)</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        variant={type === "reject" ? "destructive" : "default"}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { Button } from "@/components/ui/button"
import type { CheckingItem } from "../types"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileText, ExternalLink } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<CheckingItem>[] = [
    {
        accessorKey: "data_envio",
        header: "Data",
    },
    {
        accessorKey: "n_pi",
        header: "PI",
        cell: ({ row }) => <span className="font-medium">{row.getValue("n_pi")}</span>
    },
    {
        accessorKey: "cliente",
        header: "Cliente",
    },
    {
        accessorKey: "fornecedor",
        header: "Fornecedor",
    },
    {
        accessorKey: "display_status",
        header: "Status",
        cell: ({ row }) => {
            const isResubmission = row.original.is_resubmission
            return (
                <Badge variant={isResubmission ? "destructive" : "secondary"}>
                    {row.getValue("display_status")}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" /> Abrir Pasta
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

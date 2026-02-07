import { Filter, Download } from "lucide-react"
import { useState } from "react"
import { CSVLink } from "react-csv"
import { Button } from "@/components/ui/button"

interface FilterDropdownProps {
    onFilterChange: (filters: { status?: string; client?: string }) => void
}

export function FilterDropdown({ onFilterChange }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [selectedClient, setSelectedClient] = useState<string>("all")

    const handleApply = () => {
        onFilterChange({
            status: selectedStatus === "all" ? undefined : selectedStatus,
            client: selectedClient === "all" ? undefined : selectedClient
        })
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                size="sm"
                className="gap-2"
            >
                <Filter className="h-4 w-4" />
                Filtrar
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-72 bg-card border border-border rounded-lg shadow-xl z-50 p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                            >
                                <option value="all">Todos</option>
                                <option value="Success">Sucesso</option>
                                <option value="Error">Erro</option>
                                <option value="Pending">Pendente</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Cliente</label>
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                            >
                                <option value="all">Todos os Clientes</option>
                                <option value="Coca-Cola">Coca-Cola</option>
                                <option value="Samsung">Samsung</option>
                                <option value="Nike">Nike</option>
                                <option value="Amazon">Amazon</option>
                                <option value="McDonald's">McDonald's</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    setSelectedStatus("all")
                                    setSelectedClient("all")
                                    onFilterChange({})
                                    setIsOpen(false)
                                }}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                Limpar
                            </Button>
                            <Button
                                onClick={handleApply}
                                size="sm"
                                className="flex-1"
                            >
                                Aplicar
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

interface ExportCSVButtonProps {
    data: any[]
    filename?: string
}

export function ExportCSVButton({ data, filename = "dados-verificacao.csv" }: ExportCSVButtonProps) {
    const headers = [
        { label: "Timestamp", key: "timestamp" },
        { label: "Cliente", key: "cliente" },
        { label: "Número PI", key: "pi" },
        { label: "Veículo", key: "veiculo" },
        { label: "Status", key: "status" },
        { label: "Link Drive", key: "driveLink" }
    ]

    return (
        <CSVLink
            data={data}
            headers={headers}
            filename={filename}
            className="inline-flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-vibrant-blue/90 transition-colors text-sm font-medium"
        >
            <Download className="h-4 w-4" />
            Exportar CSV
        </CSVLink>
    )
}

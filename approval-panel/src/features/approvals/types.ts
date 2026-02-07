export type ApprovalStatus = "PENDENTE" | "APROVADO" | "REPROVADO"

export interface CheckingItem {
    id: string
    data_envio: string
    n_pi: string
    cliente: string
    veiculo: string
    fornecedor: string
    email: string
    webViewLink: string
    totalArquivos: number
    approval_status: ApprovalStatus
    rejection_count: number
    rejection_reason?: string
    rejection_pdf_link?: string
    is_resubmission: boolean
    display_status: string
    button_type: "standard" | "confirm"
}

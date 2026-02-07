import { api, endpoints } from "@/lib/axios"

export interface CheckingFilter {
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    page?: number
    limit?: number
}

export interface ApprovalActionPayload {
    id: string
    action: 'approve' | 'reject'
    reason?: string
}

export const fetchCheckings = async (filters: CheckingFilter) => {
    // Maps to N8N 'get_checkings' action with query params
    const { data } = await api.post(endpoints.webhook, {
        action: 'get_checkings',
        ...filters
    });
    return data;
}

// Legacy/Specific Support for Dashboard/Pending View
export const fetchPending = async () => {
    const { data } = await api.post(endpoints.webhook, { action: 'get_pending' });
    return data.checkings || [];
}

export const fetchCheckingDetails = async (id: string) => {
    const { data } = await api.post(endpoints.webhook, {
        action: 'get_checking_details',
        id
    });
    return data;
}

export interface ApprovalProcessPayload extends ApprovalActionPayload {
    file?: File | null
    approval_user: string
}

export const processApproval = async (payload: ApprovalProcessPayload) => {
    if (payload.file) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('action', payload.action);
        formData.append('id', payload.id);
        formData.append('approval_user', payload.approval_user);
        if (payload.reason) formData.append('reason', payload.reason);
        formData.append('pdf_file', payload.file);

        const { data } = await api.post(endpoints.webhook, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    } else {
        // Standard JSON request
        const { data } = await api.post(endpoints.webhook, {
            ...payload
        });
        return data;
    }
}

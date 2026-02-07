import { api, endpoints } from "@/lib/axios"

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'editor' | 'viewer'
    createdAt: string
    lastLogin?: string
    status: 'active' | 'inactive'
}

export const fetchUsers = async () => {
    // Maps to N8N 'get_users' action
    const { data } = await api.post(endpoints.webhook, { action: 'get_users' });
    return data.users || [];
}

export const updateUserRole = async (userId: string, newRole: string) => {
    const { data } = await api.post(endpoints.webhook, {
        action: 'update_user_role',
        userId,
        newRole
    });
    return data;
}

export const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const { data } = await api.post(endpoints.webhook, {
        action: 'update_user_status',
        userId,
        status: currentStatus === 'active' ? 'inactive' : 'active'
    });
    return data;
}

export const registerUser = async (userData: any) => {
    const { data } = await api.post(endpoints.webhook, {
        action: 'register_user',
        body: userData
    });
    return data;
}

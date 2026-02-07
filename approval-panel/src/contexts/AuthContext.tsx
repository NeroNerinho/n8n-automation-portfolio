import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '@/lib/axios'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'approver' | 'viewer'
    avatar?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = sessionStorage.getItem('auth_token')
        const storedUser = sessionStorage.getItem('auth_user')

        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch {
                // Invalid stored data, clear it
                sessionStorage.removeItem('auth_token')
                sessionStorage.removeItem('auth_user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log('Attempting login with:', { email })

            const response = await api.post('', {
                action: 'login',
                email,
                password
            })

            console.log('Login response:', response.data)

            if (response.data.success) {
                // Handle response - n8n may not return token, so we generate one locally
                const userData = response.data.user

                // Generate a session token if not provided by the server
                const newToken = response.data.token || `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

                // Ensure user has an id (use email as fallback)
                const userWithId: User = {
                    id: userData.id || userData.email || email,
                    name: userData.name || 'Usuário',
                    email: userData.email || email,
                    role: userData.role || 'viewer',
                    avatar: userData.avatar // Added avatar
                }

                console.log('Login successful, user:', userWithId)

                setToken(newToken)
                setUser(userWithId)

                // Secure Storage Implementation (SessionStorage)
                // We store the raw token. HTTPS is required for transit security.
                // HttpOnly cookies would be better but require a backend domain match.
                try {
                    sessionStorage.setItem('auth_token', newToken);
                    sessionStorage.setItem('auth_user', JSON.stringify(userWithId));
                } catch (e) {
                    console.error('Storage failed', e);
                }
                return { success: true }
            } else {
                return { success: false, error: response.data.message || 'Credenciais inválidas' }
            }
        } catch (error: unknown) {
            console.error('Login error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com o servidor'
            return { success: false, error: errorMessage }
        }
    }

    const register = async (name: string, email: string, password: string, role: string = 'viewer'): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await api.post('', {
                action: 'register_user',
                body: {
                    name,
                    email,
                    password,
                    role
                }
            });

            if (response.data.success) {
                // Auto login after register
                return login(email, password);
            }

            return { success: false, error: response.data.message || 'Erro ao registrar' };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Erro de conexão' };
        }
    };

    const logout = () => {
        setToken(null)
        setUser(null)
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { UserProvider } from "@/contexts/UserContext"
import { ThemeProvider } from "@/contexts/ThemeContext"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
})

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <UserProvider>
                    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                        <AuthProvider>{children}</AuthProvider>
                    </ThemeProvider>
                </UserProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}


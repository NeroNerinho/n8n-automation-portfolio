import { User, Settings, LogOut, Bell } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useUser } from "@/contexts/UserContext"

export function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { user, logout, isAuthenticated } = useAuth()
    const { userAvatar } = useUser()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black">
                    {userAvatar.svg}
                </div>
                <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-border bg-gradient-to-br from-vibrant-blue/5 to-vibrant-purple/5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black">
                                {userAvatar.svg}
                            </div>
                            <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm">
                            <User className="h-4 w-4" />
                            <span>Meu Perfil</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm">
                            <Bell className="h-4 w-4" />
                            <span>Notificações</span>
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm"
                        >
                            <Settings className="h-4 w-4" />
                            <span>Configurações</span>
                        </button>
                    </div>

                    <div className="p-2 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors text-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

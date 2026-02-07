import { Sidebar } from "@/layouts/Sidebar"
import { Outlet, Link, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { GlobalSearch } from "@/components/GlobalSearch"
import { UserMenu } from "@/components/UserMenu"
import { Footer } from "@/components/Footer"
import { WebGLShader } from "@/components/ui/webgl-shader"

import { useTheme } from "@/contexts/ThemeContext"

export default function AppShell() {
    const location = useLocation()
    const { theme, setTheme } = useTheme()

    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const navItems = [
        { name: "Painel", path: "/" },

        { name: "Relatórios", path: "/reports" },
        { name: "Configurações", path: "/settings" }
    ]

    return (
        <>
            {/* Background Shader Animation - Persistent across routes */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <WebGLShader />
            </div>

            {/* Dark Overlay for content readability */}
            <div className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

            {/* Rainbow Bar at Top */}
            <div className="rainbow-bar fixed top-0 left-0 right-0 z-50" />

            {/* Main Layout - z-10 to sit above background */}
            <div className="relative z-10 flex h-screen overflow-hidden font-sans text-foreground pt-[3px]">
                <Sidebar className="hidden md:flex shrink-0 z-20" />
                <div className="flex-1 flex flex-col md:overflow-hidden bg-transparent">
                    <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 flex items-center justify-between z-10 sticky top-[3px] shadow-sm gap-4">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center justify-center">
                                <img
                                    src="/logo-grupoom.png"
                                    alt="Hub de Automação"
                                    className="h-8 w-auto object-contain brightness-0 invert"
                                />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold tracking-tight whitespace-nowrap text-white">HUB DE AUTOMAÇÃO</h1>
                                <p className="text-[9px] text-zinc-400 font-mono uppercase tracking-wide">CENTRO DE COMANDO</p>
                            </div>
                        </div>

                        {/* Global Search - Hidden on small screens */}
                        <div className="hidden lg:flex flex-1 max-w-2xl">
                            <GlobalSearch />
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Navigation */}
                            <nav className="hidden xl:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${location.pathname === item.path
                                            ? "bg-vibrant-blue text-white shadow-lg shadow-blue-500/20"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Live Status Indicator */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="relative w-2 h-2">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full pulse-ring" />
                                    <div className="relative w-2 h-2 bg-emerald-500 rounded-full" />
                                </div>
                                <span className="text-xs font-medium text-emerald-400">AO VIVO</span>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                title="Alternar tema"
                            >
                                <svg className="w-5 h-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <svg className="w-5 h-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>

                            {/* User Menu */}
                            <UserMenu />
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6 md:p-8 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>

            {/* Rainbow Bar at Bottom */}
            <div className="rainbow-bar fixed bottom-0 left-0 right-0 z-50 opacity-50" />
        </>
    )
}

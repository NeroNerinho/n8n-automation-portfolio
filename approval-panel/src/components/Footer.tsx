import { ExternalLink } from "lucide-react"

export function Footer() {
    const version = "v4.2.0"
    const currentYear = new Date().getFullYear()

    const links = [
        { label: "Central de Suporte", href: "#support" },
        { label: "Documentação da API", href: "#api-docs" },
        { label: "Status do Sistema", href: "#status" },
        { label: "⚡ Operacional", href: "#", badge: true }
    ]

    return (
        <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto relative z-10 transition-all duration-300 hover:bg-black/60">
            <div className="px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: Version & Branding */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 font-mono">
                                Hub de Automação | Motor de Inteligência
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded border border-white/10 font-mono">
                                {version}
                            </span>
                        </div>
                        <span className="text-[10px] text-zinc-600">
                            © {currentYear} Todos os direitos reservados
                        </span>
                    </div>

                    {/* Center: Company Signatures */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                            <img
                                src="/company-signatures.png"
                                alt="Empresas do Hub de Automação"
                                className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>

                    {/* Right: Links */}
                    <div className="flex items-center gap-4">
                        {links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                className={`text-[10px] transition-colors flex items-center gap-1 ${link.badge
                                    ? "text-emerald-400 font-medium"
                                    : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {link.label}
                                {!link.badge && <ExternalLink className="h-2.5 w-2.5" />}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

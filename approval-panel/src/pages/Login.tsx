import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AnimatedForm } from "@/components/ui/modern-animated-sign-in"
import { WebGLShader } from "@/components/ui/webgl-shader"


import { useSecurity } from "@/hooks/useSecurity"

export default function Login() {
    const { login } = useAuth()
    const { sanitize, validateEmail } = useSecurity()
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/dashboard"

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const form = e.currentTarget
        const emailInput = form.querySelector('input[name="Email"]') as HTMLInputElement
        const passwordInput = form.querySelector('input[name="Senha"]') as HTMLInputElement

        const rawEmail = emailInput?.value || ""
        const rawPassword = passwordInput?.value || ""

        if (!validateEmail(rawEmail)) {
            setError("Formato de e-mail inválido")
            return
        }

        const email = sanitize(rawEmail)
        const password = sanitize(rawPassword)

        if (!email || !password) {
            setError("Preencha todos os campos")
            return
        }

        try {
            const result = await login(email, password)
            if (result.success) {
                navigate(from, { replace: true })
            } else {
                setError(result.error || "Falha no login")
            }
        } catch (error) {
            setError("Erro ao conectar com o servidor")
            console.error(error)
        }
    }

    return (
        <div className="relative min-h-screen w-full font-sans bg-black overflow-hidden flex flex-col">
            {/* Background Shader Animation - Covers Full Screen (z-0) */}
            <div className="absolute inset-0 z-0">
                <WebGLShader />
            </div>

            {/* Dark Overlay for better text contrast if needed */}
            <div className="absolute inset-0 z-0 bg-black/10 pointer-events-none" />

            {/* Split Layout Container (z-10) */}
            <div className="relative z-10 grid flex-1 lg:grid-cols-2">

                {/* Left Side - Branding + Company Logos */}
                <div className="hidden lg:flex flex-col p-10 justify-between">
                    {/* Top: Main Logo */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo-grupoom.png"
                            alt="Hub de Automação"
                            className="h-12 w-auto object-contain brightness-0 invert"
                        />
                    </div>

                    <div className="flex flex-col justify-center mt-24">
                        <h1 className="text-8xl font-bold text-white mb-2 tracking-tighter mix-blend-exclusion">
                            Hub de Automação
                        </h1>
                        <p className="text-3xl text-zinc-300 font-light tracking-widest uppercase mix-blend-exclusion mb-12">
                            Aprovação de Mídia
                        </p>

                        {/* Brand Logos Grid (Left Side) */}
                        <div className="flex flex-col items-start gap-4 mt-4">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
                                Unidades de Negócio
                            </p>
                            <div className="grid grid-cols-3 gap-6 opacity-90">
                                {/* Using available logos from public folder */}
                                <img src="/logo-opus.png" alt="Opus" className="h-6 w-auto object-contain brightness-0 invert hover:opacity-100 transition-opacity" />
                                <img src="/logo-dom.png" alt="Dom" className="h-6 w-auto object-contain brightness-0 invert hover:opacity-100 transition-opacity" />
                                <img src="/logo-americas.png" alt="Americas" className="h-6 w-auto object-contain brightness-0 invert hover:opacity-100 transition-opacity" />
                                <img src="/logo-pixel.png" alt="Pixel" className="h-6 w-auto object-contain brightness-0 invert hover:opacity-100 transition-opacity" />
                                <img src="/logo-senso.png" alt="Senso" className="h-6 w-auto object-contain brightness-0 invert hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-20 mt-auto pb-4">
                        <blockquote className="space-y-4 border-l-4 border-white/30 pl-6 py-2">
                            <p className="text-xl font-light leading-relaxed text-zinc-200">
                                "Sistema centralizado para gestão e aprovação de materiais de mídia."
                            </p>
                        </blockquote>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 bg-black/40 backdrop-blur-xl border-l border-white/5 shadow-2xl">
                    <div className="w-full max-w-md space-y-8 glass-form-theme">
                        <AnimatedForm
                            header="Acessar Painel"
                            subHeader="Autenticação Corporativa"
                            submitButton="Entrar"
                            errorField={error || undefined}
                            fields={[
                                {
                                    label: "Email",
                                    type: "email",
                                    placeholder: "seu@email.com",
                                    required: true,
                                    onChange: () => { }
                                },
                                {
                                    label: "Senha",
                                    type: "password",
                                    placeholder: "••••••••",
                                    required: true,
                                    onChange: () => { }
                                }
                            ]}
                            onSubmit={handleSubmit}
                        />

                        <div className="mt-8 text-center space-y-4">
                            <Link to="/register" className="text-sm text-zinc-400 hover:text-white transition-colors block">
                                Ainda não tem acesso? <span className="font-bold underline">Cadastrar</span>
                            </Link>

                            {/* Footer: Company Signatures (Right Side) */}
                            <div className="pt-8 border-t border-white/10 flex flex-col items-center">
                                <img
                                    src="/company-signatures.png"
                                    alt="Empresas"
                                    className="h-12 w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                                />
                                <p className="text-[10px] text-zinc-600 font-mono mt-3 uppercase tracking-wider">
                                    Motor de Inteligência &middot; v4.2
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <style>{`
                /* Theme Overrides for Glass Look on Right Side */
                .glass-form-theme input {
                    background-color: rgba(0, 0, 0, 0.4) !important;
                    border-color: rgba(255, 255, 255, 0.15) !important;
                    color: white !important;
                    backdrop-filter: blur(10px);
                    transition: all 0.2s ease;
                }
                .glass-form-theme input:focus {
                    border-color: rgba(255, 255, 255, 0.4) !important;
                    background-color: rgba(0, 0, 0, 0.6) !important;
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
                }
                .glass-form-theme input::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
                .glass-form-theme label {
                    color: rgba(255, 255, 255, 0.8) !important;
                    font-size: 0.875rem;
                }
                .glass-form-theme h2 { /* Header */
                    color: white !important;
                    font-weight: 600 !important;
                }
                .glass-form-theme p { /* Subheader */
                    color: rgba(255, 255, 255, 0.5) !important;
                }
                 .glass-form-theme button[type="submit"] {
                    background: white !important;
                    color: black !important;
                    font-weight: 600 !important;
                    height: 2.75rem;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.8);
                }
                .glass-form-theme button[type="submit"]:hover {
                    background: #e4e4e7 !important; /* zinc-200 */
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(255,255,255,0.15);
                }
            `}</style>
        </div>
    )
}


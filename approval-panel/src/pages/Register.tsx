import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AnimatedForm } from "@/components/ui/modern-animated-sign-in"
import { WebGLShader } from "@/components/ui/webgl-shader"
import { useSecurity } from "@/hooks/useSecurity"

export default function Register() {
    const { register } = useAuth()
    const { sanitize, validateEmail } = useSecurity()
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const form = e.currentTarget

        // Extract values
        const nameInput = form.querySelector('input[name="Nome Completo"]') as HTMLInputElement
        const emailInput = form.querySelector('input[name="Email"]') as HTMLInputElement
        const passwordInput = form.querySelector('input[name="Senha"]') as HTMLInputElement
        const confirmInput = form.querySelector('input[name="Confirmar Senha"]') as HTMLInputElement


        // Validation
        const rawEmail = emailInput?.value || ""
        const rawPassword = passwordInput?.value || ""
        const rawConfirm = confirmInput?.value || ""
        const rawName = nameInput?.value || ""

        if (!validateEmail(rawEmail)) {
            setError("Formato de e-mail inválido")
            return
        }

        if (rawPassword.length < 8) {
            setError("A senha deve ter no mínimo 8 caracteres")
            return
        }

        if (rawPassword !== rawConfirm) {
            setError("As senhas não coincidem")
            return
        }

        try {
            const email = sanitize(rawEmail)
            const password = sanitize(rawPassword)
            const name = sanitize(rawName)
            const deptInput = form.querySelector('select[name="Departamento"]') as HTMLSelectElement
            const role = deptInput?.value || "viewer"

            // Register Call
            const result = await register(name, email, password, role)

            if (result.success) {
                // Redirect to Login on success
                navigate("/login", { state: { message: "Cadastro realizado com sucesso! Faça login." } })
            } else {
                setError(result.error || "Falha no cadastro")
            }
        } catch (error) {
            setError("Erro ao conectar com o servidor")
            console.error(error)
        }
    }

    return (
        <div className="relative min-h-screen w-full font-sans bg-black overflow-hidden flex flex-col">
            <div className="absolute inset-0 z-0">
                <WebGLShader />
            </div>
            <div className="absolute inset-0 z-0 bg-black/10 pointer-events-none" />

            <div className="relative z-10 grid flex-1 lg:grid-cols-2">
                <div className="hidden lg:flex flex-col p-10 justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/logo-grupoom.png" alt="Hub de Automação" className="h-12 w-auto object-contain brightness-0 invert" />
                    </div>
                    <div className="flex flex-col justify-center mt-32">
                        <h1 className="text-8xl font-bold text-white mb-6 tracking-tighter mix-blend-exclusion">
                            Hub de Automação
                        </h1>
                        <p className="text-3xl text-zinc-300 font-light tracking-widest uppercase mix-blend-exclusion mb-12">
                            Novo Acesso
                        </p>
                    </div>
                    <div className="relative z-20 mt-auto pb-10">
                        <blockquote className="space-y-4 border-l-4 border-white/30 pl-6 py-2">
                            <p className="text-xl font-light leading-relaxed text-zinc-200">
                                "Junte-se à plataforma centralizada de gestão de mídia."
                            </p>
                        </blockquote>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 bg-black/40 backdrop-blur-xl border-l border-white/5 shadow-2xl">
                    <div className="w-full max-w-md space-y-8 glass-form-theme">
                        <AnimatedForm
                            header="Criar Conta"
                            subHeader="Cadastro de Colaborador"
                            submitButton="Cadastrar"
                            errorField={error || undefined}
                            fields={[
                                { label: "Nome Completo", type: "text", placeholder: "Seu nome", required: true, onChange: () => { } },
                                { label: "Email", type: "email", placeholder: "seu@email.com", required: true, onChange: () => { } },
                                { label: "Departamento", type: "select", options: ["Mídia", "Criação", "Atendimento", "Planejamento"], required: true, onChange: () => { } },
                                { label: "Senha", type: "password", placeholder: "Mínimo 8 caracteres", required: true, onChange: () => { } },
                                { label: "Confirmar Senha", type: "password", placeholder: "Repita a senha", required: true, onChange: () => { } }
                            ]}
                            onSubmit={handleSubmit}
                        />
                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                Já tem acesso? <span className="font-bold underline">Entrar</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                /* Glass Theme Styles */
                .glass-form-theme input, .glass-form-theme select {
                    background-color: rgba(0, 0, 0, 0.4) !important;
                    border-color: rgba(255, 255, 255, 0.15) !important;
                    color: white !important;
                    backdrop-filter: blur(10px);
                    transition: all 0.2s ease;
                }
                .glass-form-theme input:focus, .glass-form-theme select:focus {
                    border-color: rgba(255, 255, 255, 0.4) !important;
                    background-color: rgba(0, 0, 0, 0.6) !important;
                }
                 .glass-form-theme label { color: rgba(255, 255, 255, 0.8) !important; }
                 .glass-form-theme h2 { color: white !important; }
                 .glass-form-theme p { color: rgba(255, 255, 255, 0.5) !important; }
                 .glass-form-theme button[type="submit"] {
                    background: white !important;
                    color: black !important;
                }
            `}</style>
        </div>
    )
}

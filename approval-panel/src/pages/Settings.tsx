import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Palette, Shield, Settings2, Mail, Users, AlertTriangle } from "lucide-react"
import { AvatarPicker } from "@/components/AvatarPicker"
import { useUser } from "@/contexts/UserContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useSecurity } from "@/hooks/useSecurity"
import { UserManagement } from "@/features/users/components/UserManagement"

const settingsSections = [
    { id: "account", label: "Conta", icon: User },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "users", label: "Usuários", icon: Users },
    { id: "system", label: "Sistema", icon: Settings2 },
]

export default function Settings() {
    const {
        userName, setUserName,
        userEmail, setUserEmail,
        userRole, setUserRole,
        userBio, setUserBio
    } = useUser()
    const { sanitize, validateInput } = useSecurity()
    const [activeSection, setActiveSection] = useState("account")
    const { theme, setTheme } = useTheme()
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)

    const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Gerencie preferências e configurações do sistema
                </p>
            </div>

            {/* Settings Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar Navigation */}
                <aside className="lg:w-64 shrink-0">
                    <nav className="space-y-1 sticky top-24">
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                    ? "bg-gradient-to-r from-vibrant-blue to-vibrant-purple text-white shadow-md"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <section.icon className="h-4 w-4" />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Account Settings */}
                    {activeSection === "account" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Avatar</CardTitle>
                                    <CardDescription>
                                        Personalize sua identidade visual
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AvatarPicker />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Perfil do Usuário</CardTitle>
                                    <CardDescription>
                                        Atualize suas informações pessoais
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Nome</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="Seu nome"
                                                value={userName}
                                                onChange={(e) => {
                                                    if (validateInput(e.target.value)) {
                                                        setUserName(e.target.value)
                                                    }
                                                }}
                                                onBlur={(e) => setUserName(sanitize(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Cargo</Label>
                                            <Input
                                                id="role"
                                                placeholder="Seu cargo"
                                                value={userRole}
                                                onChange={(e) => {
                                                    if (validateInput(e.target.value)) {
                                                        setUserRole(e.target.value)
                                                    }
                                                }}
                                                onBlur={(e) => setUserRole(sanitize(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="usuario@grupoom.com"
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                onBlur={(e) => setUserEmail(sanitize(e.target.value))}
                                            />
                                            <Badge className="shrink-0 bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300">
                                                <Mail className="h-3 w-3 mr-1" />
                                                Verificado
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Conte um pouco sobre você..."
                                            rows={4}
                                            value={userBio}
                                            onChange={(e) => {
                                                if (validateInput(e.target.value, 500)) {
                                                    setUserBio(e.target.value)
                                                }
                                            }}
                                            onBlur={(e) => setUserBio(sanitize(e.target.value))}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline">Cancelar</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeSection === "appearance" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tema</CardTitle>
                                    <CardDescription>
                                        Personalize a aparência do painel
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => handleThemeChange("light")}
                                            className={`relative p-4 rounded-lg border-2 transition-all ${theme === "light"
                                                ? "border-vibrant-blue shadow-lg shadow-vibrant-blue/20"
                                                : "border-border hover:border-muted-foreground"
                                                }`}
                                        >
                                            <div className="aspect-video bg-white rounded-md mb-3 border shadow-sm flex items-center justify-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full" />
                                            </div>
                                            <div className="text-sm font-medium">Claro</div>
                                            {theme === "light" && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-5 h-5 bg-vibrant-blue rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleThemeChange("dark")}
                                            className={`relative p-4 rounded-lg border-2 transition-all ${theme === "dark"
                                                ? "border-vibrant-purple shadow-lg shadow-vibrant-purple/20"
                                                : "border-border hover:border-muted-foreground"
                                                }`}
                                        >
                                            <div className="aspect-video bg-slate-900 rounded-md mb-3 border shadow-sm flex items-center justify-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full" />
                                            </div>
                                            <div className="text-sm font-medium">Escuro</div>
                                            {theme === "dark" && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-5 h-5 bg-vibrant-purple rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleThemeChange("system")}
                                            className={`relative p-4 rounded-lg border-2 transition-all ${theme === "system"
                                                ? "border-vibrant-green shadow-lg shadow-vibrant-green/20"
                                                : "border-border hover:border-muted-foreground"
                                                }`}
                                        >
                                            <div className="aspect-video bg-gradient-to-r from-white to-slate-900 rounded-md mb-3 border shadow-sm flex items-center justify-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-purple-500 to-purple-900 rounded-full" />
                                            </div>
                                            <div className="text-sm font-medium">Sistema</div>
                                            {theme === "system" && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-5 h-5 bg-vibrant-green rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold">Efeitos Visuais</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Rainbow Bar Animada</Label>
                                                <p className="text-sm text-muted-foreground">Barra gradiente no topo e rodapé</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Animações Suaves</Label>
                                                <p className="text-sm text-muted-foreground">Transitions e hover effects</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Notifications Settings */}
                    {activeSection === "notifications" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preferências de Notificação</CardTitle>
                                    <CardDescription>
                                        Configure como você deseja receber atualizações
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Notificações por Email</Label>
                                            <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                                        </div>
                                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Notificações Push</Label>
                                            <p className="text-sm text-muted-foreground">Alertas em tempo real no navegador</p>
                                        </div>
                                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Aprovações Pendentes</Label>
                                            <p className="text-sm text-muted-foreground">Notificar quando houver novos checkings</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Relatórios Semanais</Label>
                                            <p className="text-sm text-muted-foreground">Resumo de atividades enviado toda segunda</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeSection === "security" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Segurança da Conta</CardTitle>
                                    <CardDescription>
                                        Proteja sua conta com configurações de segurança
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Alterar Senha</h4>
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Senha Atual</Label>
                                                    <Input id="currentPassword" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">Nova Senha</Label>
                                                    <Input id="newPassword" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                                    <Input id="confirmPassword" type="password" />
                                                </div>
                                                <Button>Atualizar Senha</Button>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Autenticação de Dois Fatores</Label>
                                                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                                            </div>
                                            <Button variant="outline">Configurar</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* System Settings */}
                    {activeSection === "system" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configurações do Sistema</CardTitle>
                                    <CardDescription>
                                        Preferências gerais e informações do aplicativo
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Versão</p>
                                            <p className="text-lg font-semibold">2.1.0</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Ambiente</p>
                                            <Badge>Production</Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">API Status</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                <span className="text-sm font-medium text-green-700 dark:text-green-400">Conectado</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">N8N Webhook</p>
                                            <Badge variant="outline" className="font-mono text-xs">Ativo</Badge>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Modo de Desenvolvedor</Label>
                                            <p className="text-sm text-muted-foreground">Ativa recursos avançados e logs</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Logs Detalhados</Label>
                                            <p className="text-sm text-muted-foreground">Exibe informações técnicas no console</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                                    <CardDescription>
                                        Ações irreversíveis que afetam sua conta
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label>Limpar Cache</Label>
                                                <p className="text-sm text-muted-foreground">Remove dados temporários armazenados</p>
                                            </div>
                                            <Button variant="outline" size="sm">Limpar</Button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label>Resetar Configurações</Label>
                                                <p className="text-sm text-muted-foreground">Restaura padrões de fábrica</p>
                                            </div>
                                            <Button variant="outline" size="sm">Resetar</Button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label>Deletar Conta</Label>
                                                <p className="text-sm text-muted-foreground">Exclui permanentemente sua conta</p>
                                            </div>
                                            <Button variant="destructive" size="sm">Deletar</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {/* Users Section - Admin Only */}
                    {activeSection === "users" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Usuários</CardTitle>
                                            <CardDescription>
                                                Gerenciamento de usuários e permissões do sistema
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <UserManagement />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* System Settings */}
                    {activeSection === "system" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Sistema</CardTitle>
                                <CardDescription>
                                    Informações e configurações do sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted flex items-start gap-4">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Versão do Sistema</p>
                                        <p className="text-sm text-muted-foreground">checking-central-app v1.0.0 (Beta)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

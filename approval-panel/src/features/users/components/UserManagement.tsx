import { useState, useEffect } from "react"
import { fetchUsers, updateUserRole, toggleUserStatus, registerUser, type User } from "../api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, User as UserIcon, AlertTriangle, Settings2, UserPlus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isRegistering, setIsRegistering] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // New User State
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "viewer" as const
    })

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setIsLoading(true)
        try {
            const data = await fetchUsers()
            setUsers(data)
        } catch (err) {
            setError("Falha ao carregar usuários. Verifique suas permissões.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole)
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u))
        } catch (err) {
            console.error("Failed to update role", err)
            setError("Erro ao atualizar função.")
        }
    }

    const handleStatusToggle = async (userId: string, status: string) => {
        try {
            await toggleUserStatus(userId, status)
            setUsers(users.map(u => u.id === userId ? { ...u, status: status === 'active' ? 'inactive' : 'active' } : u))
        } catch (err) {
            console.error("Failed to update status", err)
            setError("Erro ao atualizar status.")
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsRegistering(true)
        setError("")
        try {
            await registerUser(newUser)
            setIsDialogOpen(false)
            setNewUser({ name: "", email: "", password: "", role: "viewer" })
            loadUsers()
        } catch (err: any) {
            setError(err.response?.data?.error || "Erro ao registrar usuário. Tente novamente.")
        } finally {
            setIsRegistering(false)
        }
    }



    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
                    <p className="text-sm text-muted-foreground">
                        Controle o acesso e permissões dos usuários do sistema.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={loadUsers} variant="outline" size="sm">
                        Atualizar Lista
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-vibrant-blue hover:bg-vibrant-blue/90 text-white">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Novo Usuário
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle>Registrar Novo Usuário</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Adicione um novo colaborador ao sistema de aprovação.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleRegister} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        className="bg-black/40 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Corporativo</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        className="bg-black/40 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha Inicial</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        className="bg-black/40 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Função</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(val: any) => setNewUser({ ...newUser, role: val })}
                                    >
                                        <SelectTrigger className="bg-black/40 border-white/10">
                                            <SelectValue placeholder="Selecione uma função" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isRegistering}
                                        className="w-full bg-vibrant-blue hover:bg-vibrant-blue/90"
                                    >
                                        {isRegistering ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Registrando...
                                            </>
                                        ) : "Criar Usuário"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/20 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Usuário</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Carregando usuários...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(val) => handleRoleChange(user.id, val)}
                                                disabled={user.role === 'admin' && user.email === 'admin@grupoom.com'}
                                            >
                                                <SelectTrigger className="w-[24px] h-6 p-0 border-none bg-transparent">
                                                    <Settings2 className="h-3 w-3 opacity-50 hover:opacity-100" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                    <SelectItem value="editor">Editor</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'active' ? 'default' : 'destructive'}
                                            className="cursor-pointer"
                                            onClick={() => handleStatusToggle(user.id, user.status)}
                                        >
                                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" disabled>
                                            <Shield className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {error && (
                <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    )
}

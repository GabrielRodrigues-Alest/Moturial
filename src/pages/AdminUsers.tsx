/**
 * Admin Users Management Page
 * 
 * Comprehensive user management interface for administrators.
 * Follows .ai-rules for production-ready code with security and validation.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: string[];
  memberships: UserMembership[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface UserMembership {
  orgId?: string;
  franchiseId?: string;
  storeId?: string;
  role: string;
}

interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'staff' | 'user';
}

interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  role?: 'admin' | 'staff' | 'user';
  isActive?: boolean;
}

const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'user'
  });
  
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});

  // Fetch users with search and filter
  const usersQuery = useQuery({
    queryKey: ['admin', 'users', searchTerm, roleFilter],
    queryFn: async () => {
      // Mock data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@moturial.com',
          fullName: 'Administrador Sistema',
          phone: '+5511999999999',
          roles: ['admin'],
          memberships: [{ role: 'admin' }],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true
        },
        {
          id: '2',
          email: 'staff@moturial.com',
          fullName: 'Funcionário Loja Centro',
          phone: '+5511888888888',
          roles: ['staff'],
          memberships: [{ storeId: '1', role: 'staff' }],
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          isActive: true
        },
        {
          id: '3',
          email: 'user@example.com',
          fullName: 'João Silva',
          phone: '+5511777777777',
          roles: ['user'],
          memberships: [{ role: 'user' }],
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z',
          isActive: true
        }
      ];
      
      // Apply filters
      let filteredUsers = mockUsers;
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          user.roles.includes(roleFilter)
        );
      }
      
      return filteredUsers;
    },
    staleTime: 60_000,
    retry: 1,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserRequest) => {
      // Replace with actual API call
      return apiClient.post('/admin/users', userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'user'
      });
      toast({
        title: 'Usuário criado',
        description: 'Usuário criado com sucesso!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message || 'Falha ao criar usuário',
        variant: 'destructive'
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserRequest }) => {
      // Replace with actual API call
      return apiClient.put(`/admin/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setEditForm({});
      toast({
        title: 'Usuário atualizado',
        description: 'Usuário atualizado com sucesso!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Falha ao atualizar usuário',
        variant: 'destructive'
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Replace with actual API call
      return apiClient.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'Usuário removido',
        description: 'Usuário removido com sucesso!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover usuário',
        description: error.message || 'Falha ao remover usuário',
        variant: 'destructive'
      });
    }
  });

  const handleCreateUser = () => {
    if (!createForm.email || !createForm.password || !createForm.fullName) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }
    
    createUserMutation.mutate(createForm);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      phone: user.phone,
      role: user.roles[0] as 'admin' | 'staff' | 'user',
      isActive: user.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      userId: selectedUser.id,
      data: editForm
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'staff': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'staff': return 'Funcionário';
      case 'user': return 'Usuário';
      default: return role;
    }
  };

  const users = usersQuery.data || [];

  if (usersQuery.isError) {
    const err = (usersQuery.error as any)?.message ?? 'Falha ao carregar usuários';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Gerencie usuários, permissões e acessos do sistema</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário ao sistema. Todos os campos marcados são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nome completo do usuário"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+5511999999999"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função</Label>
                <Select value={createForm.role} onValueChange={(value: 'admin' | 'staff' | 'user') => 
                  setCreateForm(prev => ({ ...prev, role: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="staff">Funcionário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="staff">Funcionários</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.roles[0])}>
                        <Shield className="w-3 h-3 mr-1" />
                        {getRoleLabel(user.roles[0])}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum usuário encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando um novo usuário.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário {selectedUser?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editFullName">Nome Completo</Label>
              <Input
                id="editFullName"
                value={editForm.fullName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPhone">Telefone</Label>
              <Input
                id="editPhone"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editRole">Função</Label>
              <Select 
                value={editForm.role} 
                onValueChange={(value: 'admin' | 'staff' | 'user') => 
                  setEditForm(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="staff">Funcionário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editForm.isActive ?? true}
                onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="editIsActive">Usuário ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;

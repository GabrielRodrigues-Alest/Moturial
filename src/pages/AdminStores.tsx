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
import { queries } from '@/lib/supabase';
import { 
  Store, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Users,
  Bike
} from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  active: boolean;
  openingHours: string;
  availableMotorcycles: number;
  totalMotorcycles: number;
  createdAt: string;
}

const AdminStores: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const storesQuery = useQuery({
    queryKey: ['admin', 'stores', 'list'],
    queryFn: async () => {
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'Moturial Centro',
          address: 'Rua Augusta, 1234',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01305-000',
          phone: '+5511999999999',
          email: 'centro@moturial.com',
          manager: 'João Silva',
          active: true,
          openingHours: '08:00 - 18:00',
          availableMotorcycles: 15,
          totalMotorcycles: 20,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Moturial Vila Madalena',
          address: 'Rua Harmonia, 567',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '05435-000',
          phone: '+5511888888888',
          email: 'vilamadalena@moturial.com',
          manager: 'Maria Santos',
          active: true,
          openingHours: '09:00 - 19:00',
          availableMotorcycles: 8,
          totalMotorcycles: 15,
          createdAt: '2024-01-20T14:30:00Z'
        },
        {
          id: '3',
          name: 'Moturial Itaim',
          address: 'Av. Faria Lima, 890',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04538-000',
          phone: '+5511777777777',
          email: 'itaim@moturial.com',
          manager: 'Pedro Costa',
          active: false,
          openingHours: '08:00 - 17:00',
          availableMotorcycles: 0,
          totalMotorcycles: 12,
          createdAt: '2024-02-01T09:15:00Z'
        }
      ];

      // Apply filters
      let filteredStores = mockStores;
      
      if (searchTerm) {
        filteredStores = filteredStores.filter(store => 
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.manager.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filteredStores = filteredStores.filter(store => 
          statusFilter === 'active' ? store.active : !store.active
        );
      }
      
      return filteredStores;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const stores = storesQuery.data || [];

  if (storesQuery.isError) {
    const err = (storesQuery.error as any)?.message ?? 'Falha ao carregar lojas';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Lojas</h1>
          <p className="text-muted-foreground">Gerencie as lojas e pontos de atendimento</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Loja
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">
                  {stores.filter(s => s.active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bike className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Motos Disponíveis</p>
                <p className="text-2xl font-bold">
                  {stores.reduce((sum, s) => sum + s.availableMotorcycles, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bike className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Motos</p>
                <p className="text-2xl font-bold">
                  {stores.reduce((sum, s) => sum + s.totalMotorcycles, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Lojas ({stores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar loja, endereço ou gerente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loja</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Gerente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Frota</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {store.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">{store.address}</div>
                          <div className="text-sm text-muted-foreground">
                            {store.city}, {store.state} - {store.zipCode}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{store.manager}</div>
                          <div className="text-sm text-muted-foreground">{store.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={store.active ? 'default' : 'secondary'}>
                        {store.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {store.availableMotorcycles}/{store.totalMotorcycles}
                        </div>
                        <div className="text-muted-foreground">disponíveis</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {store.openingHours}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {stores.length === 0 && (
            <div className="text-center py-8">
              <Store className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma loja encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'As lojas aparecerão aqui quando forem criadas.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStores;



import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { queries } from '@/lib/supabase';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye,
  DollarSign,
  User,
  Bike,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Rental {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  motorcycleId: string;
  motorcycleName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  location: string;
}

const AdminRentals: React.FC = () => {
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Mock rental data - replace with actual API call
  const rentalsQuery = useQuery({
    queryKey: ['admin', 'rentals', searchTerm, statusFilter, paymentFilter],
    queryFn: async () => {
      const mockRentals: Rental[] = [
        {
          id: '1',
          userId: '3',
          userName: 'João Silva',
          userEmail: 'joao@example.com',
          motorcycleId: '1',
          motorcycleName: 'Honda CG 160',
          startDate: '2024-01-15T08:00:00Z',
          endDate: '2024-01-16T18:00:00Z',
          status: 'completed',
          totalAmount: 45.00,
          paymentStatus: 'paid',
          createdAt: '2024-01-14T10:00:00Z',
          location: 'São Paulo - Centro'
        },
        {
          id: '2',
          userId: '4',
          userName: 'Maria Santos',
          userEmail: 'maria@example.com',
          motorcycleId: '2',
          motorcycleName: 'Honda Bros 160',
          startDate: '2024-01-20T09:00:00Z',
          endDate: '2024-01-22T17:00:00Z',
          status: 'active',
          totalAmount: 110.00,
          paymentStatus: 'paid',
          createdAt: '2024-01-19T14:30:00Z',
          location: 'São Paulo - Vila Madalena'
        },
        {
          id: '3',
          userId: '5',
          userName: 'Pedro Costa',
          userEmail: 'pedro@example.com',
          motorcycleId: '3',
          motorcycleName: 'Suzuki DR 160',
          startDate: '2024-01-25T10:00:00Z',
          endDate: '2024-01-25T16:00:00Z',
          status: 'pending',
          totalAmount: 50.00,
          paymentStatus: 'pending',
          createdAt: '2024-01-24T16:45:00Z',
          location: 'São Paulo - Centro'
        }
      ];

      // Apply filters
      let filteredRentals = mockRentals;
      
      if (searchTerm) {
        filteredRentals = filteredRentals.filter(rental => 
          rental.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.motorcycleName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filteredRentals = filteredRentals.filter(rental => rental.status === statusFilter);
      }

      if (paymentFilter !== 'all') {
        filteredRentals = filteredRentals.filter(rental => rental.paymentStatus === paymentFilter);
      }
      
      return filteredRentals;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const rentals = rentalsQuery.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { variant: 'outline' as const, label: 'Pendente', icon: Clock };
      case 'active': return { variant: 'default' as const, label: 'Ativo', icon: CheckCircle };
      case 'completed': return { variant: 'secondary' as const, label: 'Concluído', icon: CheckCircle };
      case 'cancelled': return { variant: 'destructive' as const, label: 'Cancelado', icon: XCircle };
      default: return { variant: 'outline' as const, label: status, icon: AlertCircle };
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'pending': return { variant: 'outline' as const, label: 'Pendente' };
      case 'paid': return { variant: 'default' as const, label: 'Pago' };
      case 'failed': return { variant: 'destructive' as const, label: 'Falhou' };
      case 'refunded': return { variant: 'secondary' as const, label: 'Reembolsado' };
      default: return { variant: 'outline' as const, label: status };
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startStr = start.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    const endStr = end.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${startStr} - ${endStr}`;
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 dia' : `${diffDays} dias`;
  };

  if (rentalsQuery.isError) {
    const err = (rentalsQuery.error as any)?.message ?? 'Falha ao carregar aluguéis';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Aluguéis</h1>
          <p className="text-muted-foreground">Monitore e gerencie todos os aluguéis de motocicletas</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{rentals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">
                  {rentals.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">
                  {rentals.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(rentals.reduce((sum, r) => sum + r.totalAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Aluguéis ({rentals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por usuário, email ou moto..."
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
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Pagamentos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="failed">Falharam</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Motocicleta</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => {
                  const statusBadge = getStatusBadge(rental.status);
                  const paymentBadge = getPaymentBadge(rental.paymentStatus);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{rental.userName}</div>
                            <div className="text-sm text-muted-foreground">{rental.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Bike className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{rental.motorcycleName}</div>
                            <div className="text-sm text-muted-foreground">{rental.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {formatDateRange(rental.startDate, rental.endDate)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {calculateDuration(rental.startDate, rental.endDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentBadge.variant}>
                          {paymentBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(rental.totalAmount)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {rentals.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum aluguel encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Os aluguéis aparecerão aqui quando forem criados.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRentals;

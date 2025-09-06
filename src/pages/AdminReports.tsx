import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface PaymentReport {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: string;
  customerName: string;
  customerEmail: string;
  rentalId: string;
  motorcycleName: string;
  transactionId: string;
  processingFee: number;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  averageTransaction: number;
  totalTransactions: number;
  successRate: number;
  refundRate: number;
  topPaymentMethod: string;
}

const AdminReports: React.FC = () => {
  const { toast } = useToast();
  
  const [dateFilter, setDateFilter] = useState('30days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Mock revenue statistics
  const revenueStatsQuery = useQuery({
    queryKey: ['admin', 'reports', 'revenue-stats', dateFilter],
    queryFn: async (): Promise<RevenueStats> => {
      return {
        totalRevenue: 15750.50,
        monthlyRevenue: 3250.75,
        dailyRevenue: 125.30,
        averageTransaction: 87.50,
        totalTransactions: 180,
        successRate: 94.5,
        refundRate: 2.1,
        topPaymentMethod: 'Cartão de Crédito'
      };
    },
    staleTime: 60_000,
    retry: 1,
  });

  // Mock payment reports
  const paymentsQuery = useQuery({
    queryKey: ['admin', 'reports', 'payments', dateFilter, statusFilter, methodFilter],
    queryFn: async (): Promise<PaymentReport[]> => {
      const mockPayments: PaymentReport[] = [
        {
          id: '1',
          date: '2024-01-20T14:30:00Z',
          amount: 135.00,
          status: 'completed',
          method: 'Cartão de Crédito',
          customerName: 'João Silva',
          customerEmail: 'joao@example.com',
          rentalId: 'R001',
          motorcycleName: 'Honda CG 160',
          transactionId: 'TXN123456789',
          processingFee: 4.05
        },
        {
          id: '2',
          date: '2024-01-19T10:15:00Z',
          amount: 110.00,
          status: 'completed',
          method: 'PIX',
          customerName: 'Maria Santos',
          customerEmail: 'maria@example.com',
          rentalId: 'R002',
          motorcycleName: 'Honda Bros 160',
          transactionId: 'TXN987654321',
          processingFee: 0.00
        },
        {
          id: '3',
          date: '2024-01-18T16:45:00Z',
          amount: 75.00,
          status: 'pending',
          method: 'Cartão de Débito',
          customerName: 'Pedro Costa',
          customerEmail: 'pedro@example.com',
          rentalId: 'R003',
          motorcycleName: 'Suzuki DR 160',
          transactionId: 'TXN456789123',
          processingFee: 2.25
        },
        {
          id: '4',
          date: '2024-01-17T09:20:00Z',
          amount: 90.00,
          status: 'failed',
          method: 'Cartão de Crédito',
          customerName: 'Ana Oliveira',
          customerEmail: 'ana@example.com',
          rentalId: 'R004',
          motorcycleName: 'Honda CG 160',
          transactionId: 'TXN789123456',
          processingFee: 2.70
        },
        {
          id: '5',
          date: '2024-01-16T13:10:00Z',
          amount: 150.00,
          status: 'refunded',
          method: 'PIX',
          customerName: 'Carlos Ferreira',
          customerEmail: 'carlos@example.com',
          rentalId: 'R005',
          motorcycleName: 'Honda Bros 160',
          transactionId: 'TXN321654987',
          processingFee: 0.00
        }
      ];

      // Apply filters
      let filteredPayments = mockPayments;
      
      if (statusFilter !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.status === statusFilter);
      }
      
      if (methodFilter !== 'all') {
        filteredPayments = filteredPayments.filter(payment => 
          payment.method.toLowerCase().includes(methodFilter.toLowerCase())
        );
      }
      
      return filteredPayments;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const revenueStats = revenueStatsQuery.data;
  const payments = paymentsQuery.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return { variant: 'default' as const, label: 'Concluído', icon: CheckCircle };
      case 'pending': return { variant: 'outline' as const, label: 'Pendente', icon: Clock };
      case 'failed': return { variant: 'destructive' as const, label: 'Falhou', icon: AlertCircle };
      case 'refunded': return { variant: 'secondary' as const, label: 'Reembolsado', icon: TrendingDown };
      default: return { variant: 'outline' as const, label: status, icon: AlertCircle };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (revenueStatsQuery.isError || paymentsQuery.isError) {
    const err = 'Falha ao carregar relatórios';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Pagamentos</h1>
          <p className="text-muted-foreground">Monitore receitas, transações e performance financeira</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Gráficos
          </Button>
        </div>
      </div>

      {/* Revenue Statistics */}
      {revenueStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.monthlyRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Transações</p>
                  <p className="text-2xl font-bold">{revenueStats.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <PieChart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">{revenueStats.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Stats */}
      {revenueStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueStats.averageTransaction)}
              </div>
              <p className="text-sm text-muted-foreground">Por transação</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Método Preferido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {revenueStats.topPaymentMethod}
              </div>
              <p className="text-sm text-muted-foreground">Mais utilizado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Taxa de Reembolso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {revenueStats.refundRate}%
              </div>
              <p className="text-sm text-muted-foreground">Do total</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Transações ({payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 dias</SelectItem>
                  <SelectItem value="30days">30 dias</SelectItem>
                  <SelectItem value="90days">90 dias</SelectItem>
                  <SelectItem value="1year">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="failed">Falharam</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Métodos</SelectItem>
                  <SelectItem value="credit">Cartão Crédito</SelectItem>
                  <SelectItem value="debit">Cartão Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Aluguel</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>ID Transação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(payment.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.customerName}</div>
                          <div className="text-sm text-muted-foreground">{payment.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.rentalId}</div>
                          <div className="text-sm text-muted-foreground">{payment.motorcycleName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(payment.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(payment.processingFee)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {payment.transactionId}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma transação encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente ajustar os filtros de busca.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;

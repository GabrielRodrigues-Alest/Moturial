import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Bike, 
  Store, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  // Dashboard statistics queries
  const dashboardQuery = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: queries.dashboardStats.queryFn,
    staleTime: 60_000,
    retry: 1,
  });

  const storesQuery = useQuery({
    queryKey: queries.stores.queryKey,
    queryFn: queries.stores.queryFn,
    staleTime: 60_000,
    retry: 1,
  });

  const motorcyclesQuery = useQuery({
    queryKey: queries.motorcycles.queryKey,
    queryFn: queries.motorcycles.queryFn,
    staleTime: 60_000,
    retry: 1,
  });

  if (dashboardQuery.isError || storesQuery.isError || motorcyclesQuery.isError) {
    const error = dashboardQuery.error || storesQuery.error || motorcyclesQuery.error;
    const err = (error as any)?.message ?? 'Falha ao carregar dados do dashboard';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  const stats = dashboardQuery.data || {
    totalRentals: 0,
    activeRentals: 0,
    totalRevenue: 0,
    availableMotorcycles: 0
  };

  const stores = storesQuery.data || [];
  const motorcycles = motorcyclesQuery.data || [];
  const availableMotorcycles = motorcycles.filter(m => m.available).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema Moturial</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="w-3 h-3 mr-1" />
            Sistema Online
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Aluguéis</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRentals}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aluguéis Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRentals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeRentals > 0 ? 'Motos em uso' : 'Nenhuma moto em uso'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motos Disponíveis</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableMotorcycles}</div>
            <p className="text-xs text-muted-foreground">
              de {motorcycles.length} motos totais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Gerenciar Usuários</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Bike className="h-6 w-6" />
                <span className="text-sm">Frota de Motos</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Store className="h-6 w-6" />
                <span className="text-sm">Gerenciar Lojas</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Backend</span>
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Base de Dados</span>
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sistema de Pagamentos</span>
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  Operacional
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lojas Ativas</span>
                <Badge variant="outline">
                  {stores.length} lojas
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm">Nova moto Honda CG 160 adicionada à frota</span>
              </div>
              <span className="text-xs text-muted-foreground">2 horas atrás</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Pagamento de R$ 150,00 processado com sucesso</span>
              </div>
              <span className="text-xs text-muted-foreground">4 horas atrás</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm">Usuário solicitou suporte técnico</span>
              </div>
              <span className="text-xs text-muted-foreground">6 horas atrás</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm">Novo usuário cadastrado no sistema</span>
              </div>
              <span className="text-xs text-muted-foreground">8 horas atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;



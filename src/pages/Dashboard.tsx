import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Bike, 
  Calendar, 
  MapPin, 
  CreditCard,
  Settings,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">LG</span>
              </div>
              <h1 className="text-xl font-bold text-primary">LOCAGORA</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-muted-foreground">
            Gerencie suas locações e explore novos planos
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locações Ativas</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                +1 desde último mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 dias</div>
              <p className="text-xs text-muted-foreground">
                Plano Mensal - DR 160
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loja Preferida</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SP Centro</div>
              <p className="text-xs text-muted-foreground">
                2.5km de distância
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Economia Mensal</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 450</div>
              <p className="text-xs text-muted-foreground">
                vs. taxi/uber
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Rentals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bike className="w-5 h-5 mr-2" />
                Minhas Locações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bike className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Suzuki DR 160</h4>
                    <p className="text-sm text-muted-foreground">Plano Mensal</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Ativa</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Vence em 5 dias</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bike className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Suzuki DR 160</h4>
                    <p className="text-sm text-muted-foreground">Plano Básico</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Reservada</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Inicia amanhã</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" size="lg">
                <Bike className="w-5 h-5 mr-3" />
                Nova Locação
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <MapPin className="w-5 h-5 mr-3" />
                Encontrar Loja
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <CreditCard className="w-5 h-5 mr-3" />
                Meus Pagamentos
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <User className="w-5 h-5 mr-3" />
                Meu Perfil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border-l-4 border-l-primary bg-primary/5 rounded">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Pagamento realizado com sucesso</p>
                  <p className="text-sm text-muted-foreground">Plano Mensal - R$ 450,00 • Há 2 dias</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border-l-4 border-l-secondary bg-secondary/5 rounded">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Moto retirada na loja</p>
                  <p className="text-sm text-muted-foreground">LocaGora Centro SP • Há 3 dias</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border-l-4 border-l-muted bg-muted/10 rounded">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Cadastro atualizado</p>
                  <p className="text-sm text-muted-foreground">Informações de perfil • Há 1 semana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bike, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Wrench,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, queries } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const StaffDashboard: React.FC = () => {
  const [bikes, setBikes] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [endKm, setEndKm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement staff-specific queries based on their store/franchise
      // For now, loading all data as demo
      
      const { data: bikesData } = await queries.getBikes('33333333-3333-3333-3333-333333333333'); // Demo store ID
      setBikes(bikesData || []);

      // TODO: Load rentals for staff's store
      setRentals([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRental = async () => {
    if (!selectedRental || !endKm) {
      toast({
        title: "Erro",
        description: "Selecione um aluguel e informe a quilometragem final",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await api.closeRental(selectedRental.id, parseInt(endKm));
      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluguel finalizado com sucesso",
      });

      setSelectedRental(null);
      setEndKm('');
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível finalizar o aluguel",
        variant: "destructive"
      });
    }
  };

  const updateBikeStatus = async (bikeId: string, status: string) => {
    // TODO: Implement bike status update
    toast({
      title: "Info",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      available: { label: 'Disponível', variant: 'default' as const, icon: CheckCircle },
      reserved: { label: 'Reservado', variant: 'secondary' as const, icon: Calendar },
      rented: { label: 'Alugado', variant: 'default' as const, icon: Users },
      maintenance: { label: 'Manutenção', variant: 'destructive' as const, icon: Wrench },
      unavailable: { label: 'Indisponível', variant: 'outline' as const, icon: AlertTriangle },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'secondary' as const, 
      icon: AlertTriangle 
    };
    
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Você precisa estar logado para acessar o painel administrativo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie motocicletas, aluguéis e operações da loja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motos Disponíveis</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bikes.filter(b => b.status === 'available').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aluguéis Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.filter(r => r.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bikes.filter(b => b.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bikes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bikes">Motocicletas</TabsTrigger>
          <TabsTrigger value="rentals">Aluguéis</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="bikes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frota de Motocicletas</CardTitle>
              <CardDescription>
                Gerencie o status e manutenção das motocicletas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : bikes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma motocicleta cadastrada
                </div>
              ) : (
                <div className="space-y-4">
                  {bikes.map((bike) => (
                    <div key={bike.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Bike className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">
                            {bike.bike_models?.brand} {bike.bike_models?.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {bike.plate} • Cor: {bike.color} • {bike.odometer} km
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(bike.status)}
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBikeStatus(bike.id, 'maintenance')}
                            disabled={bike.status === 'rented'}
                          >
                            Manutenção
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBikeStatus(bike.id, 'available')}
                            disabled={bike.status === 'rented'}
                          >
                            Disponível
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aluguéis Ativos</CardTitle>
              <CardDescription>
                Gerencie devoluções e status dos aluguéis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rentals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum aluguel ativo no momento
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rental items would be rendered here */}
                  <div className="text-center py-8 text-muted-foreground">
                    Funcionalidade em desenvolvimento
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Finalizar Aluguel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Finalizar Aluguel</DialogTitle>
                <DialogDescription>
                  Registre a devolução da motocicleta
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="end-km">Quilometragem Final</Label>
                  <Input
                    id="end-km"
                    type="number"
                    placeholder="Ex: 15250"
                    value={endKm}
                    onChange={(e) => setEndKm(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleCloseRental} className="w-full">
                  Confirmar Devolução
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>
                Visualize métricas e relatórios da operação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Relatórios em desenvolvimento
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
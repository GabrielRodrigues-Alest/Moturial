import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Bike, DollarSign } from 'lucide-react';
import { useRental } from '@/contexts/RentalContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SummaryProps {
  onNavigate: (page: string) => void;
}

const Summary: React.FC<SummaryProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const { rentalState, clearRentalState } = useRental();
  const { user } = useAuth();
  const { toast } = useToast();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const handleConfirmReservation = async () => {
    if (!user || !rentalState.selectedStore || !rentalState.selectedBike || !rentalState.selectedPlan) {
      toast({
        title: "Erro",
        description: "Dados incompletos para criar a reserva",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Set start date to tomorrow if not set
      const startDate = rentalState.selectedStartDate || new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const { data, error } = await api.createRental(
        user.id,
        rentalState.selectedStore.id,
        rentalState.selectedBike.id,
        rentalState.selectedPlan.id,
        startDate.toISOString()
      );

      if (error) throw error;

      toast({
        title: "Reserva Criada!",
        description: "Sua reserva foi criada com sucesso. Proceda para o pagamento.",
      });

      // Navigate to checkout with rental data
      onNavigate('checkout');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a reserva",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!rentalState.selectedStore || !rentalState.selectedBike || !rentalState.selectedPlan) {
    onNavigate('stores');
    return null;
  }

  const totalPrice = rentalState.quotedPrice || rentalState.selectedPlan.base_price_cents;
  const depositPrice = rentalState.selectedPlan.deposit_cents || 0;
  const finalPrice = totalPrice + depositPrice;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('plans')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Planos
        </Button>

        <h1 className="text-3xl font-bold mb-4">Resumo da Reserva</h1>
        <p className="text-muted-foreground">
          Confirme os detalhes da sua reserva antes de prosseguir
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalhes da Reserva */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Loja Selecionada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">{rentalState.selectedStore.name}</h3>
              <p className="text-sm text-muted-foreground">
                {rentalState.selectedStore.address}<br />
                {rentalState.selectedStore.city}, {rentalState.selectedStore.state}
              </p>
              {rentalState.selectedStore.phone && (
                <p className="text-sm mt-2">📞 {rentalState.selectedStore.phone}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bike className="h-5 w-5" />
                Motocicleta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">
                {rentalState.selectedBike.bike_models.brand} {rentalState.selectedBike.bike_models.model}
              </h3>
              <div className="space-y-1 mt-2">
                <p className="text-sm">
                  <strong>Cor:</strong> <span className="capitalize">{rentalState.selectedBike.color}</span>
                </p>
                <p className="text-sm">
                  <strong>Ano:</strong> {rentalState.selectedBike.bike_models.year}
                </p>
                <p className="text-sm">
                  <strong>Placa:</strong> {rentalState.selectedBike.plate}
                </p>
                <p className="text-sm">
                  <strong>Quilometragem:</strong> {rentalState.selectedBike.odometer.toLocaleString()} km
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">{rentalState.selectedPlan.name}</h3>
              <p className="text-sm text-muted-foreground">
                {rentalState.selectedPlan.description}
              </p>
              <div className="mt-2">
                <p className="text-sm">
                  <strong>Início:</strong> {rentalState.selectedStartDate 
                    ? rentalState.selectedStartDate.toLocaleDateString('pt-BR')
                    : 'Amanhã'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Financeiro */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Valor do Plano:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                {depositPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Caução:</span>
                    <span>{formatPrice(depositPrice)}</span>
                  </div>
                )}
                
                <hr />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Importante:</strong> A caução será devolvida após a devolução da motocicleta em perfeitas condições.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">1</Badge>
                <span className="text-sm">Confirmar reserva</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">2</Badge>
                <span className="text-sm">Realizar pagamento</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">3</Badge>
                <span className="text-sm">Retirar na loja</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleConfirmReservation}
            disabled={loading || !user}
            size="lg"
            className="w-full"
          >
            {loading ? 'Criando Reserva...' : 'Confirmar Reserva'}
            {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>

          {!user && (
            <p className="text-sm text-center text-muted-foreground">
              Você precisa estar logado para confirmar a reserva
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, DollarSign } from 'lucide-react';
import { queries, api } from '@/lib/supabase';
import { useRental } from '@/contexts/RentalContext';
import { useToast } from '@/hooks/use-toast';

interface PlansProps {
  onNavigate: (page: string) => void;
}

const Plans: React.FC<PlansProps> = ({ onNavigate }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoting, setQuoting] = useState<string | null>(null);
  const { rentalState, setSelectedPlan, setQuotedPrice } = useRental();
  const { toast } = useToast();

  useEffect(() => {
    if (!rentalState.selectedStore || !rentalState.selectedBike) {
      onNavigate('stores');
      return;
    }
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await queries.getRentalPlans();
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: any) => {
    setQuoting(plan.id);
    
    try {
      const { data, error } = await api.quoteRental(plan.id);
      if (error) throw error;

      setSelectedPlan(plan);
      setQuotedPrice(data.price_cents);
      onNavigate('summary');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível calcular o preço",
        variant: "destructive"
      });
    } finally {
      setQuoting(null);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const formatDuration = (type: string, qty: number) => {
    const durations = {
      hour: 'hora',
      day: 'dia',
      month: 'mês',
      year: 'ano'
    };
    const duration = durations[type as keyof typeof durations] || type;
    return qty === 1 ? `1 ${duration}` : `${qty} ${duration}s`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando planos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('bikes')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Motocicletas
        </Button>

        <h1 className="text-3xl font-bold mb-4">Escolha seu Plano</h1>
        <div className="text-muted-foreground space-y-1">
          <p>Loja: <strong>{rentalState.selectedStore?.name}</strong></p>
          <p>Moto: <strong>{rentalState.selectedBike?.bike_models.brand} {rentalState.selectedBike?.bike_models.model}</strong> ({rentalState.selectedBike?.color})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`hover:shadow-lg transition-shadow ${
              index === 1 ? 'ring-2 ring-primary relative' : ''
            }`}
          >
            {index === 1 && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                Mais Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {formatDuration(plan.duration_type, plan.duration_qty)}
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(plan.base_price_cents)}
                </div>
                
                {plan.deposit_cents > 0 && (
                  <p className="text-sm text-muted-foreground">
                    + {formatPrice(plan.deposit_cents)} de caução
                  </p>
                )}
              </div>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={quoting === plan.id}
                className="w-full"
              >
                {quoting === plan.id ? 'Calculando...' : 'Selecionar Plano'}
                {quoting !== plan.id && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum plano disponível no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default Plans;
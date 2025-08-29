import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Bike, Gauge } from 'lucide-react';
import { queries } from '@/lib/supabase';
import { useRental } from '@/contexts/RentalContext';
import { useToast } from '@/hooks/use-toast';
import { getMotorcycleImage } from '@/lib/motorcycleImages';

interface BikesProps {
  onNavigate: (page: string) => void;
}

const Bikes: React.FC<BikesProps> = ({ onNavigate }) => {
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { rentalState, setSelectedBike } = useRental();
  const { toast } = useToast();

  useEffect(() => {
    if (!rentalState.selectedStore) {
      onNavigate('stores');
      return;
    }
    loadBikes();
  }, [rentalState.selectedStore]);

  const loadBikes = async () => {
    if (!rentalState.selectedStore) return;
    
    try {
      const { data, error } = await queries.getBikes(rentalState.selectedStore.id);
      if (error) throw error;
      setBikes(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as motocicletas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBike = (bike: any) => {
    setSelectedBike(bike);
    onNavigate('plans');
  };

  const formatSpecs = (specs: any) => {
    if (!specs) return '';
    return Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando motocicletas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('stores')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Lojas
        </Button>

        <h1 className="text-3xl font-bold mb-4">Escolha sua Motocicleta</h1>
        <p className="text-muted-foreground">
          Loja selecionada: <strong>{rentalState.selectedStore?.name}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <Card key={bike.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bike className="h-5 w-5 text-primary" />
                  {bike.bike_models.brand} {bike.bike_models.model}
                </CardTitle>
                <Badge variant={bike.status === 'available' ? 'default' : 'secondary'}>
                  {bike.status === 'available' ? 'Disponível' : 'Indisponível'}
                </Badge>
              </div>
              <CardDescription>
                Cor: <strong className="capitalize">{bike.color}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={getMotorcycleImage(
                    bike.bike_models.brand,
                    bike.bike_models.model,
                    bike.bike_models.image_urls
                  )}
                  alt={`${bike.bike_models.brand} ${bike.bike_models.model}`}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Ano:</strong> {bike.bike_models.year}
                </p>
                <p className="text-sm">
                  <strong>Placa:</strong> {bike.plate}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  {bike.odometer.toLocaleString()} km
                </p>
                {bike.bike_models.specs && (
                  <p className="text-sm">
                    <strong>Especificações:</strong><br />
                    {formatSpecs(bike.bike_models.specs)}
                  </p>
                )}
              </div>

              <Button
                onClick={() => handleSelectBike(bike)}
                disabled={bike.status !== 'available'}
                className="w-full"
              >
                {bike.status === 'available' ? 'Selecionar Moto' : 'Indisponível'}
                {bike.status === 'available' && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {bikes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma motocicleta disponível nesta loja no momento.
          </p>
          <Button
            variant="outline"
            onClick={() => onNavigate('stores')}
            className="mt-4"
          >
            Escolher Outra Loja
          </Button>
        </div>
      )}
    </div>
  );
};

export default Bikes;
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, ChevronRight } from 'lucide-react';
import { queries } from '@/lib/supabase';
import { useRental } from '@/contexts/RentalContext';
import { useToast } from '@/hooks/use-toast';

interface StoresProps {
  onNavigate: (page: string) => void;
}

const Stores: React.FC<StoresProps> = ({ onNavigate }) => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedStore } = useRental();
  const { toast } = useToast();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const { data, error } = await queries.getStores();
      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as lojas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStore = (store: any) => {
    setSelectedStore(store);
    onNavigate('bikes');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando lojas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Escolha uma Loja</h1>
        <p className="text-muted-foreground">
          Selecione a loja mais próxima para retirar sua motocicleta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {store.name}
              </CardTitle>
              <CardDescription>
                {store.franchises?.name} - {store.franchises?.orgs?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Endereço:</strong><br />
                  {store.address}<br />
                  {store.city}, {store.state} - {store.zip_code}
                </p>
                {store.phone && (
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {store.phone}
                  </p>
                )}
              </div>
              
              <Button
                onClick={() => handleSelectStore(store)}
                className="w-full"
              >
                Selecionar Loja
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma loja disponível no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stores;
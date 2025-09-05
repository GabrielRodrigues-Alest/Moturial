import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ShoppingCart, Package, Shield } from 'lucide-react';
import { queries } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AccessoriesProps {
  onNavigate: (page: string) => void;
}

const Accessories: React.FC<AccessoriesProps> = ({ onNavigate }) => {
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = async () => {
    try {
      const { data, error } = await queries.getAccessories();
      if (error) throw error;
      setAccessories(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os acessórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const addToCart = (accessory: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === accessory.id);
      if (existing) {
        return prev.map(item =>
          item.id === accessory.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...accessory, quantity: 1 }];
    });

    toast({
      title: "Adicionado!",
      description: `${accessory.name} foi adicionado ao carrinho`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return Shield;
      case 'storage':
        return Package;
      default:
        return Package;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categories = {
      safety: { label: 'Segurança', variant: 'default' as const },
      storage: { label: 'Armazenamento', variant: 'secondary' as const },
    };
    
    const config = categories[category as keyof typeof categories] || {
      label: category,
      variant: 'outline' as const
    };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando acessórios...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar ao Início
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">Acessórios</h1>
            <p className="text-muted-foreground">
              Equipamentos e acessórios para sua motocicleta
            </p>
          </div>

          {totalCartItems > 0 && (
            <Card className="w-64">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Carrinho ({totalCartItems} itens)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-semibold text-primary">
                  Total: {formatPrice(totalCartValue)}
                </div>
                <Button size="sm" className="w-full mt-2">
                  Finalizar Pedido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessories.map((accessory) => {
          const Icon = getCategoryIcon(accessory.category);
          
          return (
            <Card key={accessory.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{accessory.name}</CardTitle>
                  </div>
                  {getCategoryBadge(accessory.category)}
                </div>
                {accessory.description && (
                  <CardDescription>{accessory.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {accessory.image_url && (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={accessory.image_url}
                      alt={accessory.name}
                      className="object-cover w-full h-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(accessory.price_cents)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {accessory.stock} em estoque
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => addToCart(accessory)}
                  disabled={accessory.stock <= 0}
                  className="w-full"
                >
                  {accessory.stock <= 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}
                  {accessory.stock > 0 && <ShoppingCart className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {accessories.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhum acessório disponível no momento.
          </p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Itens no Carrinho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold">
                      {formatPrice(item.price_cents * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(totalCartValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">
          📦 Informações sobre Retirada
        </h3>
        <p className="text-sm text-blue-700">
          Os acessórios devem ser retirados na loja junto com a motocicleta alugada. 
          O pagamento pode ser feito antecipadamente ou no momento da retirada.
        </p>
      </div>
    </div>
  );
};

export default Accessories;
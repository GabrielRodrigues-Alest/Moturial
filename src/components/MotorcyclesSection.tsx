import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, Calendar, MapPin } from "lucide-react";
import suzukiDR160 from "@/assets/suzuki-dr160.jpg";
import { queries } from "@/lib/supabase";
import { getMotorcycleImage } from "@/lib/motorcycleImages";

interface MotorcyclesSectionProps {
  onNavigate?: (page: string) => void;
}

const MotorcyclesSection = ({ onNavigate }: MotorcyclesSectionProps) => {
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMotorcycles();
  }, []);

  const loadMotorcycles = async () => {
    try {
      const { data, error } = await queries.getBikesPublic();
      if (error) throw error;
      
      // Group by model and take unique models
      const uniqueModels = data?.reduce((acc: any[], bike: any) => {
        const existingModel = acc.find(m => m.brand === bike.brand && m.model === bike.model);
        if (!existingModel) {
          acc.push({
            id: bike.id,
            name: `${bike.brand} ${bike.model}`,
            model: bike.year,
            image: getMotorcycleImage(bike.brand, bike.model, bike.image_urls),
            dailyPrice: 100, // Default price - could be calculated from rental plans
            available: bike.status === 'available',
            colors: [bike.color],
            features: bike.specs ? Object.values(bike.specs).slice(0, 4) : ["Partida elétrica", "Freio a disco"],
            stores: [bike.store_name],
            cities: [bike.city]
          });
        } else {
          // Add color and store if not already present
          if (!existingModel.colors.includes(bike.color)) {
            existingModel.colors.push(bike.color);
          }
          if (!existingModel.stores.includes(bike.store_name)) {
            existingModel.stores.push(bike.store_name);
          }
          if (!existingModel.cities.includes(bike.city)) {
            existingModel.cities.push(bike.city);
          }
        }
        return acc;
      }, []) || [];
      
      setMotorcycles(uniqueModels);
    } catch (error) {
      console.error('Error loading motorcycles:', error);
      // Fallback to static data
      setMotorcycles([
        {
          id: 1,
          name: "Motocicletas Disponíveis",
          model: "2024",
          image: suzukiDR160,
          dailyPrice: 100,
          available: true,
          colors: ["Várias cores"],
          features: ["Partida elétrica", "Freio a disco", "Baixo consumo"],
          stores: ["Várias lojas"],
          cities: ["Diversas cidades"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="text-lg">Carregando motocicletas disponíveis...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Gauge className="w-4 h-4 mr-2" />
            Nossa Frota
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Motocicletas Disponíveis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Motocicletas em perfeito estado, com manutenção regular e seguro incluso.
            Disponível em várias cores e pronta para suas aventuras.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {motorcycles.map((moto) => (
            <Card key={moto.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative bg-gradient-to-br from-muted to-muted/50 p-8">
                  <img
                    src={moto.image}
                    alt={moto.name}
                    className="w-full h-64 md:h-full object-contain"
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${
                      moto.available 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-destructive text-destructive-foreground"
                    }`}
                  >
                    {moto.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{moto.name}</h3>
                      <p className="text-muted-foreground">Modelo {moto.model}</p>
                      <p className="text-sm text-primary font-medium mt-1">
                        Caução: R$ {moto.deposit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        R$ {moto.dailyPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">por dia</div>
                    </div>
                  </div>

                  {/* Pricing Options */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="font-semibold">R$ {moto.dailyPrice}</div>
                      <div className="text-xs text-muted-foreground">Diária</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="font-semibold">R$ 53</div>
                      <div className="text-xs text-muted-foreground">Por dia/mês</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="font-semibold">R$ 47,50</div>
                      <div className="text-xs text-muted-foreground">Por dia/sem</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Gauge className="w-4 h-4 mr-2" />
                      Características
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {moto.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                   {/* Colors and Locations */}
                   <div className="mb-6 space-y-4">
                     <div>
                       <h4 className="font-semibold mb-3">Cores Disponíveis</h4>
                       <div className="flex flex-wrap gap-2">
                         {moto.colors.map((color, index) => (
                           <Badge key={index} variant="secondary">
                             {color}
                           </Badge>
                         ))}
                       </div>
                     </div>
                     {moto.cities && (
                       <div>
                         <h4 className="font-semibold mb-3">Disponível em</h4>
                         <div className="flex flex-wrap gap-2">
                           {moto.cities.map((city, index) => (
                             <Badge key={index} variant="outline">
                               {city}
                             </Badge>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => onNavigate?.("stores")}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Encontrar Loja
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate?.("plans")}
                    >
                      Ver Planos
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-muted/30 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Fuel className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-xl font-semibold">Importante</h3>
          </div>
          <p className="text-muted-foreground">
            A moto deve ser devolvida com o tanque cheio. 
            Manutenção preventiva e seguro inclusos nos planos mensais e anuais.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MotorcyclesSection;
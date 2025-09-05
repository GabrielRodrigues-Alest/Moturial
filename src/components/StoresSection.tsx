import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Clock, Search, Navigation } from "lucide-react";

interface StoresSectionProps {
  onNavigate?: (page: string) => void;
}

const StoresSection = ({ onNavigate }: StoresSectionProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userLocation, setUserLocation] = React.useState<string>("");

  const stores = [
    {
      id: 1,
      name: "LocaGora São Paulo Centro",
      address: "Rua Augusta, 1500 - Consolação, São Paulo - SP",
      phone: "(11) 3456-7890",
      distance: "2.1 km",
      status: "Aberta",
      hours: "08:00 - 18:00",
      availableBikes: 8,
      coordinates: { lat: -23.5505, lng: -46.6333 },
    },
    {
      id: 2,
      name: "LocaGora Rio de Janeiro Copacabana",
      address: "Av. Nossa Senhora de Copacabana, 1234 - Copacabana, Rio de Janeiro - RJ",
      phone: "(21) 2345-6789",
      distance: "350 km",
      status: "Aberta",
      hours: "07:00 - 19:00",
      availableBikes: 12,
      coordinates: { lat: -22.9068, lng: -43.1729 },
    },
    {
      id: 3,
      name: "LocaGora Belo Horizonte Savassi",
      address: "Rua Pernambuco, 750 - Savassi, Belo Horizonte - MG",
      phone: "(31) 3456-7890",
      distance: "280 km",
      status: "Fechada",
      hours: "08:00 - 17:00",
      availableBikes: 5,
      coordinates: { lat: -19.9167, lng: -43.9345 },
    },
    {
      id: 4,
      name: "LocaGora Porto Alegre Moinhos",
      address: "Rua Padre Chagas, 456 - Moinhos de Vento, Porto Alegre - RS",
      phone: "(51) 3456-7890",
      distance: "1100 km",
      status: "Aberta", 
      hours: "08:00 - 18:00",
      availableBikes: 15,
      coordinates: { lat: -30.0346, lng: -51.2177 },
    },
    {
      id: 5,
      name: "LocaGora Salvador Pituba",
      address: "Av. Paulo VI, 1234 - Pituba, Salvador - BA",
      phone: "(71) 3456-7890",
      distance: "1200 km",
      status: "Aberta",
      hours: "07:00 - 18:00",
      availableBikes: 9,
      coordinates: { lat: -12.9714, lng: -38.5014 },
    },
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          // Simulate finding nearest store
          alert("Localização obtida! Mostrando lojas mais próximas.");
        },
        (error) => {
          alert("Não foi possível obter sua localização. Tente novamente.");
        }
      );
    } else {
      alert("Geolocalização não é suportada neste navegador.");
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nearestStore = stores[0]; // Simulating nearest store

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            Nossas Lojas
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Encontre a Loja Mais Próxima
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temos franquias espalhadas por todo o Brasil. 
            Encontre a mais próxima de você e retire sua moto.
          </p>
        </div>

        {/* Location Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Digite sua cidade ou CEP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleGetLocation}>
              <Navigation className="w-4 h-4 mr-2" />
              Usar Minha Localização
            </Button>
          </div>
        </div>

        {/* Nearest Store Highlight */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold">Loja Mais Próxima</h3>
              <Badge variant="secondary" className="ml-auto">
                {nearestStore.distance}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">{nearestStore.name}</h4>
                <p className="text-muted-foreground text-sm mb-3">{nearestStore.address}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {nearestStore.phone}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {nearestStore.hours}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Status:</span>
                  <Badge variant={nearestStore.status === "Aberta" ? "default" : "destructive"}>
                    {nearestStore.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">Motos disponíveis:</span>
                  <span className="font-semibold text-primary">{nearestStore.availableBikes}</span>
                </div>
                <Button variant="hero" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ir para Esta Loja
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* All Stores */}
        <div className="grid gap-6 max-w-6xl mx-auto">
          {filteredStores.map((store) => (
            <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="grid md:grid-cols-3 gap-0">
                {/* Store Info */}
                <div className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{store.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{store.address}</p>
                      </div>
                      <Badge variant={store.status === "Aberta" ? "default" : "destructive"}>
                        {store.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        {store.phone}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        {store.hours}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {store.distance}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-center text-xs">🏍️</span>
                        {store.availableBikes} motos disponíveis
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center p-6 bg-muted/30">
                  <div className="space-y-3">
                    <Button variant="default" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      Ver Localização
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </Button>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => onNavigate?.("register")}
                    >
                      Alugar Aqui
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Mapa das Lojas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Mapa interativo em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use os botões "Ver Localização" para abrir no Google Maps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StoresSection;
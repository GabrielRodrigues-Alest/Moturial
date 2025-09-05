import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package } from "lucide-react";

interface AccessoriesSectionProps {
  onNavigate?: (page: string) => void;
}

const AccessoriesSection = ({ onNavigate }: AccessoriesSectionProps) => {
  const accessories = [
    {
      id: 1,
      name: "Capacete LocaGora Pro",
      price: 120,
      originalPrice: 150,
      image: "🪖",
      description: "Capacete de segurança premium com ventilação otimizada",
      rating: 4.8,
      category: "Proteção",
    },
    {
      id: 2,
      name: "Luvas Antiderrapante",
      price: 45,
      originalPrice: null,
      image: "🧤",
      description: "Luvas com grip especial para melhor aderência",
      rating: 4.6,
      category: "Proteção",
    },
    {
      id: 3,
      name: "Calça de Motociclista",
      price: 180,
      originalPrice: 220,
      image: "👖",
      description: "Calça resistente com proteção nas articulações",
      rating: 4.7,
      category: "Vestuário",
    },
    {
      id: 4,
      name: "Camiseta LocaGora",
      price: 35,
      originalPrice: null,
      image: "👕",
      description: "Camiseta personalizada da marca em algodão premium",
      rating: 4.5,
      category: "Vestuário",
    },
    {
      id: 5,
      name: "Jaqueta Impermeável",
      price: 200,
      originalPrice: 250,
      image: "🧥",
      description: "Jaqueta à prova d'água com refletores de segurança",
      rating: 4.9,
      category: "Vestuário",
    },
    {
      id: 6,
      name: "Moletom Canguru LocaGora",
      price: 80,
      originalPrice: null,
      image: "👟",
      description: "Moletom confortável com capuz e bolso frontal",
      rating: 4.4,
      category: "Vestuário",
    },
  ];

  const categories = ["Todos", "Proteção", "Vestuário"];
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");

  const filteredAccessories = selectedCategory === "Todos" 
    ? accessories 
    : accessories.filter(item => item.category === selectedCategory);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Package className="w-4 h-4 mr-2" />
            Loja de Acessórios
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Acessórios LocaGora
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete sua experiência com nossos acessórios oficiais. 
            Qualidade premium para sua segurança e conforto.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-muted/50 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Accessories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredAccessories.map((accessory) => (
            <Card key={accessory.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">{accessory.image}</div>
                <CardTitle className="text-lg">{accessory.name}</CardTitle>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{accessory.rating}</span>
                  <span className="text-sm text-muted-foreground">(126)</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {accessory.description}
                </p>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {accessory.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {accessory.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      R$ {accessory.price}
                    </span>
                  </div>
                  {accessory.originalPrice && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      -{Math.round((1 - accessory.price / accessory.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promotional Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 text-center border border-primary/20">
          <h3 className="text-2xl font-bold mb-4">
            Desconto Especial para Clientes
          </h3>
          <p className="text-muted-foreground mb-6">
            Clientes do plano anual têm 20% de desconto em todos os acessórios!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" onClick={() => onNavigate?.("plans")}>
              Ver Planos
            </Button>
            <Button variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Button>
          </div>
        </div>

        {/* Shopping Cart Summary */}
        <div className="mt-8 max-w-md mx-auto bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Carrinho</h4>
            <Badge variant="secondary">0 itens</Badge>
          </div>
          <div className="text-center text-muted-foreground text-sm">
            Adicione acessórios ao seu carrinho para continuar
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessoriesSection;
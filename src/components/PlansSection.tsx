import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Wrench, Truck } from "lucide-react";
import suzukiDR160 from "@/assets/suzuki-dr160.jpg";

interface PlansSectionProps {
  onNavigate?: (page: string) => void;
}

const PlansSection = ({ onNavigate }: PlansSectionProps) => {
  const plans = [
    {
      id: "daily",
      name: "MOTURIAL DIÁRIO",
      subtitle: "Ideal para uso ocasional",
      price: 100,
      period: "dia",
      originalPrice: null,
      discount: null,
      popular: false,
      features: [
        "Qualquer modelo por 1 dia",
        "Seguro básico incluso", 
        "Suporte via WhatsApp",
        "Documentação simples",
        "Entrega com tanque cheio",
      ],
      notIncluded: [
        "Manutenção preventiva",
        "Seguro contra terceiros",
        "Socorro com guincho",
      ],
      colors: ["Todas as cores disponíveis"],
      buttonText: "Escolher Diário",
      dailyRate: 100,
    },
    {
      id: "monthly",
      name: "MOTURIAL MENSAL",
      subtitle: "Perfeito para uso regular (mín. 30 dias)",
      price: 1590,
      period: "mês",
      originalPrice: null,
      discount: null,
      popular: true,
      features: [
        "R$ 53/dia - mínimo 30 dias",
        "Qualquer modelo disponível",
        "Manutenção preventiva inclusa",
        "Seguro básico + roubo/furto",
        "Suporte prioritário 24/7",
        "Troca de moto em caso de problema",
        "Não precisa encher tanque",
      ],
      notIncluded: [
        "Seguro contra terceiros",
        "Socorro com guincho",
      ],
      colors: ["Todas as cores disponíveis"],
      buttonText: "Escolher Mensal",
      dailyRate: 53,
    },
    {
      id: "semestral",
      name: "MOTURIAL SEMESTRAL",
      subtitle: "Máximo benefício e economia (mín. 6 meses)",
      price: 8550,
      period: "semestre",
      originalPrice: null,
      discount: null,
      popular: false,
      features: [
        "R$ 47,50/dia - mínimo 6 meses",
        "Qualquer modelo disponível",
        "Manutenção mensal completa",
        "Seguro completo incluso",
        "Socorro com guincho 24/7",
        "Suporte VIP dedicado",
        "Troca de moto a qualquer momento",
        "Desconto em acessórios (20%)",
        "Combustível não é sua responsabilidade",
      ],
      notIncluded: [],
      colors: ["Todas as cores disponíveis"],
      buttonText: "Escolher Semestral",
      dailyRate: 47.50,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Nossos Planos
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o Plano Ideal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Diferentes opções para atender suas necessidades. 
            Todos os planos incluem moto em perfeito estado e suporte especializado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? "border-primary shadow-lg scale-105" 
                  : "hover:scale-105"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-center py-2 text-sm font-medium">
                  ⭐ MAIS POPULAR
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                <div className="mb-4">
                  <img
                    src={suzukiDR160}
                    alt="Suzuki DR 160"
                    className="w-32 h-24 object-contain mx-auto"
                  />
                </div>
                
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{plan.subtitle}</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    {plan.discount && (
                      <Badge variant="destructive" className="text-xs">
                        -{plan.discount}
                      </Badge>
                    )}
                    {plan.originalPrice && plan.originalPrice !== plan.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {plan.originalPrice}
                      </span>
                    )}
                  </div>
                <div className="text-3xl font-bold text-primary mt-2">
                  R$ {plan.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.dailyRate && plan.period !== "dia" ? (
                    <>
                      R$ {plan.dailyRate}/dia - por {plan.period}
                    </>
                  ) : (
                    `por ${plan.period}`
                  )}
                </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Included Features */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Incluído no plano
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Included (if any) */}
                {plan.notIncluded.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 text-muted-foreground text-sm">
                      Não incluído
                    </h4>
                    <ul className="space-y-1">
                      {plan.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-muted-foreground">
                          <span className="mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Colors Available */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-sm">Cores disponíveis</h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.colors.map((color, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? "hero" : "default"}
                  className="w-full"
                  onClick={() => onNavigate?.("payment")}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-card rounded-lg shadow-sm">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Seguro Incluso</h3>
            <p className="text-sm text-muted-foreground">
              Todos os planos incluem seguro básico contra danos
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-sm">
            <Wrench className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Manutenção</h3>
            <p className="text-sm text-muted-foreground">
              Planos mensais e anuais incluem manutenção preventiva
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-sm">
            <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Socorro 24/7</h3>
            <p className="text-sm text-muted-foreground">
              Plano anual inclui guincho e socorro completo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
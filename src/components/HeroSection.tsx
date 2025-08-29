import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90">
        <img
          src={heroImage}
          alt="MOTURIAL - Assinatura de Motocicletas"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-secondary-foreground">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              #1 em Assinatura de Motocicletas
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Sua moto
            <span className="block text-primary">por assinatura</span>
          </h1>

          <p className="text-xl md:text-2xl text-secondary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
            A MOTURIAL está nascendo e revolucionando a mobilidade urbana. 
            Motocicletas Suzuki DK 160, Shineray e JEF 150 disponíveis em nossos planos flexíveis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="hero"
              size="xl"
              onClick={() => onNavigate?.("register")}
              className="shadow-2xl"
            >
              <MapPin className="w-5 h-5" />
              Encontrar Nossa Loja
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => onNavigate?.("plans")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Ver Planos
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => onNavigate?.("auth")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Entrar / Cadastrar
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card/10 backdrop-blur-sm border border-border/20 rounded-lg p-6">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nossa Unidade</h3>
              <p className="text-sm text-secondary-foreground/70">
                Unidade Rio Preto em funcionamento para você
              </p>
            </div>
            <div className="bg-card/10 backdrop-blur-sm border border-border/20 rounded-lg p-6">
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Assinatura Flexível</h3>
              <p className="text-sm text-secondary-foreground/70">
                Planos diário, mensal e semestral que se adaptam a você
              </p>
            </div>
            <div className="bg-card/10 backdrop-blur-sm border border-border/20 rounded-lg p-6">
              <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Seguro Incluso</h3>
              <p className="text-sm text-secondary-foreground/70">
                Proteção completa em todos os nossos planos
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-border/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">1</div>
              <div className="text-sm text-secondary-foreground/70">Unidade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-secondary-foreground/70">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">R$ 100</div>
              <div className="text-sm text-secondary-foreground/70">Por dia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-secondary-foreground/70">Avaliação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
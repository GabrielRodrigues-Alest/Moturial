import motorialLogo from "@/assets/moturial-logo.png";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Layout = ({ children, currentPage = "home", onNavigate }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Início" },
    { id: "motorcycles", label: "Motos" },
    { id: "plans", label: "Planos" },
    { id: "accessories", label: "Acessórios" },
    { id: "stores", label: "Lojas" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={motorialLogo} 
                alt="MOTURIAL" 
                className="w-8 h-8"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-foreground">MOTURIAL</span>
                <span className="text-xs text-muted-foreground -mt-1">ASSINATURA DE MOTOS</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    currentPage === item.id
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("register")}
              >
                Cadastrar
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => onNavigate?.("login")}
              >
                Entrar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <nav className="flex flex-col space-y-3 mt-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate?.(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left py-2 text-sm font-medium transition-colors hover:text-primary ${
                      currentPage === item.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex flex-col space-y-2 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onNavigate?.("register");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Cadastrar
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => {
                      onNavigate?.("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-xl font-bold mb-4 text-primary">
                MOTURIAL
              </div>
              <p className="text-secondary-foreground/80 text-sm leading-relaxed">
                Assinatura de motos com segurança e praticidade. 
                Conectando você com a melhor experiência em mobilidade urbana.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-secondary-foreground/80">
                <p className="font-medium text-primary">Unidade Rio Preto</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>(17) 9 9749-1764</span>
                </div>
                <p>✉️ riopreto@moturial.com.br</p>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <p>Av. Alfredo Antonio de Oliveira, 1781</p>
                      <p className="text-xs">Jardim Marajó - São José do Rio Preto/SP</p>
                      <p className="text-xs">CEP 15046-355</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Planos MOTURIAL</h3>
              <div className="space-y-2 text-sm text-secondary-foreground/80">
                <p><span className="text-primary font-medium">Diário:</span> R$ 100/dia</p>
                <p><span className="text-primary font-medium">Mensal:</span> R$ 53/dia (mín. 30 dias)</p>
                <p><span className="text-primary font-medium">Semestral:</span> R$ 47,50/dia (mín. 6 meses)</p>
                <p className="text-xs text-secondary-foreground/60 mt-3">
                  *Valores de caução variam conforme o modelo da moto
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/60">
            © 2024 MOTURIAL. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
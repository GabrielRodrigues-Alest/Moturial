import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface UserRegistrationSectionProps {
  onNavigate?: (page: string) => void;
}

const UserRegistrationSection = ({ onNavigate }: UserRegistrationSectionProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    birthDate: "",
    cpf: "",
    driverLicense: "",
    cep: "",
    address: "",
    city: "",
    state: "",
  });

  const [validations, setValidations] = React.useState({
    cpfValid: null as boolean | null,
    cepValid: null as boolean | null,
    serasaCheck: null as boolean | null,
  });

  const [loading, setLoading] = React.useState({
    cep: false,
    cpf: false,
    serasa: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCPF = async (cpf: string) => {
    if (cpf.length !== 11) return;
    
    setLoading(prev => ({ ...prev, cpf: true }));
    
    // Simulate CPF validation
    setTimeout(() => {
      const isValid = cpf !== "00000000000"; // Simple validation
      setValidations(prev => ({ ...prev, cpfValid: isValid }));
      setLoading(prev => ({ ...prev, cpf: false }));
      
      if (isValid) {
        checkSerasa(cpf);
      }
    }, 1500);
  };

  const checkSerasa = async (cpf: string) => {
    setLoading(prev => ({ ...prev, serasa: true }));
    
    // Simulate Serasa check
    setTimeout(() => {
      const hasIssues = Math.random() > 0.7; // 30% chance of credit issues
      setValidations(prev => ({ ...prev, serasaCheck: !hasIssues }));
      setLoading(prev => ({ ...prev, serasa: false }));
    }, 2000);
  };

  const validateCEP = async (cep: string) => {
    if (cep.length !== 8) return;
    
    setLoading(prev => ({ ...prev, cep: true }));
    
    // Simulate CEP validation
    setTimeout(() => {
      const mockAddress = {
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
      };
      
      setFormData(prev => ({
        ...prev,
        address: mockAddress.address,
        city: mockAddress.city,
        state: mockAddress.state,
      }));
      
      setValidations(prev => ({ ...prev, cepValid: true }));
      setLoading(prev => ({ ...prev, cep: false }));
    }, 1000);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.birthDate &&
      formData.cpf &&
      formData.driverLicense &&
      formData.cep &&
      validations.cpfValid &&
      validations.cepValid &&
      validations.serasaCheck
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <User className="w-4 h-4 mr-2" />
            Cadastro de Cliente
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça Seu Cadastro
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preencha seus dados para alugar sua motocicleta. 
            Validamos automaticamente CPF, CEP e situação de crédito.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <div className="relative">
                  <Input
                    id="cpf"
                    value={formatCPF(formData.cpf)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleInputChange("cpf", value);
                      if (value.length === 11) {
                        validateCPF(value);
                      }
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {loading.cpf && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {validations.cpfValid === true && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                  {validations.cpfValid === false && (
                    <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
                </div>
                {loading.serasa && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Consultando situação de crédito no Serasa...
                    </AlertDescription>
                  </Alert>
                )}
                {validations.serasaCheck === true && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      ✅ Situação de crédito aprovada!
                    </AlertDescription>
                  </Alert>
                )}
                {validations.serasaCheck === false && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      ❌ Problemas de crédito identificados. Entre em contato conosco.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* CNH */}
              <div className="space-y-2">
                <Label htmlFor="driverLicense">Número da CNH *</Label>
                <Input
                  id="driverLicense"
                  value={formData.driverLicense}
                  onChange={(e) => handleInputChange("driverLicense", e.target.value)}
                  placeholder="Digite o número da sua carteira de motorista"
                />
              </div>

              {/* CEP */}
              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    value={formatCEP(formData.cep)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleInputChange("cep", value);
                      if (value.length === 8) {
                        validateCEP(value);
                      }
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {loading.cep && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {validations.cepValid && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Endereço (preenchido automaticamente) */}
              {validations.cepValid && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={!isFormValid()}
                  onClick={() => {
                    alert("Cadastro realizado com sucesso! Redirecionando para escolha do plano...");
                    onNavigate?.("plans");
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Finalizar Cadastro
                </Button>
                {!isFormValid() && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Preencha todos os campos obrigatórios
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Seus dados estão seguros
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Utilizamos criptografia de ponta para proteger suas informações pessoais. 
                    A consulta ao Serasa é feita de forma segura e com seu consentimento.
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

export default UserRegistrationSection;
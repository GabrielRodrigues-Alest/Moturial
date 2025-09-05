import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  FileText, 
  Shield, 
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";

interface PaymentSectionProps {
  selectedPlan?: {
    name: string;
    price: number;
    period: string;
  };
  onNavigate?: (page: string) => void;
}

const PaymentSection = ({ selectedPlan, onNavigate }: PaymentSectionProps) => {
  const [paymentMethod, setPaymentMethod] = React.useState("credit");
  const [installments, setInstallments] = React.useState(1);

  const plan = selectedPlan || {
    name: "LOCAGORA MENSAL",
    price: 500,
    period: "mês"
  };

  const paymentMethods = [
    {
      id: "credit",
      name: "Cartão de Crédito",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
      installments: true,
    },
    {
      id: "pix",
      name: "PIX",
      icon: Smartphone,
      description: "Pagamento instantâneo",
      installments: false,
      discount: 5,
    },
    {
      id: "boleto",
      name: "Boleto Bancário",
      icon: FileText,
      description: "Vencimento em 3 dias úteis",
      installments: false,
    },
  ];

  const getInstallmentOptions = () => {
    const maxInstallments = plan.price >= 300 ? 12 : 6;
    const options = [];
    
    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = plan.price / i;
      const hasInterest = i > 6;
      const interestRate = hasInterest ? (i - 6) * 2.5 : 0;
      const finalValue = hasInterest ? installmentValue * (1 + interestRate / 100) : installmentValue;
      
      options.push({
        installments: i,
        value: finalValue,
        hasInterest,
        interestRate,
        total: finalValue * i,
      });
    }
    
    return options;
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
  const finalPrice = selectedMethod?.discount 
    ? plan.price * (1 - selectedMethod.discount / 100) 
    : plan.price;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <DollarSign className="w-4 h-4 mr-2" />
            Pagamento
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Finalizar Locação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha a forma de pagamento e finalize sua locação de motocicleta.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{method.name}</h3>
                          {method.discount && (
                            <Badge variant="default" className="text-xs">
                              -{method.discount}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      {paymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Installments */}
            {selectedMethod?.installments && (
              <Card>
                <CardHeader>
                  <CardTitle>Parcelamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {getInstallmentOptions().map((option) => (
                      <div
                        key={option.installments}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          installments === option.installments
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setInstallments(option.installments)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              {option.installments}x de R$ {option.value.toFixed(2)}
                            </span>
                            {option.hasInterest && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (+{option.interestRate.toFixed(1)}% a.m.)
                              </span>
                            )}
                          </div>
                          {installments === option.installments && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        {option.hasInterest && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Total: R$ {option.total.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Credit Card Form */}
            {paymentMethod === "credit" && (
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Cartão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Validade</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="000"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome como impresso no cartão"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{plan.name}</span>
                  <span>R$ {plan.price.toFixed(2)}</span>
                </div>
                
                {selectedMethod?.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto PIX (-{selectedMethod.discount}%)</span>
                    <span>-R$ {(plan.price * selectedMethod.discount / 100).toFixed(2)}</span>
                  </div>
                )}

                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {finalPrice.toFixed(2)}</span>
                </div>

                {paymentMethod === "credit" && installments > 1 && (
                  <div className="text-sm text-muted-foreground">
                    {installments}x de R$ {(finalPrice / installments).toFixed(2)}
                  </div>
                )}

                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Próximos Passos
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pagamento processado em até 24h</li>
                    <li>• Entraremos em contato para agendamento</li>
                    <li>• Retirada na loja mais próxima</li>
                    <li>• Documentação necessária: CNH e CPF</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      Pagamento Seguro
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Seus dados são protegidos com criptografia SSL 256-bits. 
                      Processamento seguro através de parceiros certificados.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={() => {
                alert(`Pagamento de R$ ${finalPrice.toFixed(2)} processado com sucesso! Você receberá as instruções por email.`);
                onNavigate?.("home");
              }}
            >
              {paymentMethod === "pix" && "Gerar PIX"}
              {paymentMethod === "boleto" && "Gerar Boleto"}
              {paymentMethod === "credit" && "Finalizar Pagamento"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
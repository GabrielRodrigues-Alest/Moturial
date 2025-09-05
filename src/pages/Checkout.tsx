import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CreditCard, Smartphone, FileText, Copy, QrCode } from 'lucide-react';
import { useRental } from '@/contexts/RentalContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Add Pagar.me tokenization script
declare global {
  interface Window {
    PagarMeCheckout: any;
  }
}

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [cardForm, setCardForm] = useState({
    number: '',
    holder_name: '',
    exp_month: '',
    exp_year: '',
    cvv: ''
  });
  const [installments, setInstallments] = useState(1);
  const { rentalState } = useRental();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load Pagar.me tokenization script
    if (!document.querySelector('#pagarme-script')) {
      const script = document.createElement('script');
      script.id = 'pagarme-script';
      script.src = 'https://checkout.pagar.me/v1/tokenizecard.js';
      script.setAttribute('data-pagarmecheckout-app-id', 'pk_test_YOUR_PUBLIC_KEY'); // TODO: Replace with real public key
      document.head.appendChild(script);
    }
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const handleCardPayment = async () => {
    if (!user || !rentalState.selectedStore) {
      toast({
        title: "Erro",
        description: "Dados incompletos para pagamento",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrate with actual Pagar.me tokenization
      // For now, simulate tokenization
      const simulatedToken = `card_token_${Date.now()}`;

      const customer = {
        name: user.user_metadata?.full_name || user.email || 'Cliente',
        email: user.email || '',
        document: '11122233344', // TODO: Get from user profile
        document_type: 'cpf'
      };

      const { data, error } = await api.createPayment({
        ref_type: 'rental',
        ref_id: rentalState.selectedStore.id, // This should be rental_id from previous step
        method: 'card',
        card_token: simulatedToken,
        installments,
        customer
      });

      if (error) throw error;

      setPaymentResult(data);
      
      if (data.status === 'paid') {
        toast({
          title: "Pagamento Aprovado!",
          description: "Seu pagamento foi processado com sucesso",
        });
        onNavigate('success');
      }
    } catch (error: any) {
      toast({
        title: "Erro no Pagamento",
        description: error.message || "Não foi possível processar o pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePixPayment = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const customer = {
        name: user.user_metadata?.full_name || user.email || 'Cliente',
        email: user.email || '',
        document: '11122233344',
        document_type: 'cpf'
      };

      const { data, error } = await api.createPayment({
        ref_type: 'rental',
        ref_id: rentalState.selectedStore?.id || '',
        method: 'pix',
        customer
      });

      if (error) throw error;

      setPaymentResult(data);
      
      toast({
        title: "PIX Gerado!",
        description: "Use o QR Code ou copie o código para pagar",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar PIX",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBoletoPayment = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const customer = {
        name: user.user_metadata?.full_name || user.email || 'Cliente',
        email: user.email || '',
        document: '11122233344',
        document_type: 'cpf'
      };

      // Set due date to 3 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);

      const { data, error } = await api.createPayment({
        ref_type: 'rental',
        ref_id: rentalState.selectedStore?.id || '',
        method: 'boleto',
        due_at: dueDate.toISOString(),
        customer
      });

      if (error) throw error;

      setPaymentResult(data);
      
      toast({
        title: "Boleto Gerado!",
        description: "Clique no link para imprimir o boleto",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar boleto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (paymentResult?.pix_copy_paste) {
      await navigator.clipboard.writeText(paymentResult.pix_copy_paste);
      toast({
        title: "Copiado!",
        description: "Código PIX copiado para a área de transferência",
      });
    }
  };

  if (!rentalState.selectedStore || !user) {
    onNavigate('summary');
    return null;
  }

  const totalAmount = rentalState.quotedPrice || 0;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('summary')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Resumo
        </Button>

        <h1 className="text-3xl font-bold mb-4">Pagamento</h1>
        <p className="text-muted-foreground">
          Escolha a forma de pagamento e finalize sua reserva
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
              <CardDescription>
                Selecione como deseja pagar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="boleto" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Boleto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="card-number">Número do Cartão</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardForm.number}
                        onChange={(e) => setCardForm(prev => ({ ...prev, number: e.target.value }))}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="holder-name">Nome no Cartão</Label>
                      <Input
                        id="holder-name"
                        placeholder="João Silva"
                        value={cardForm.holder_name}
                        onChange={(e) => setCardForm(prev => ({ ...prev, holder_name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="exp-month">Mês</Label>
                      <Input
                        id="exp-month"
                        placeholder="12"
                        maxLength={2}
                        value={cardForm.exp_month}
                        onChange={(e) => setCardForm(prev => ({ ...prev, exp_month: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="exp-year">Ano</Label>
                      <Input
                        id="exp-year"
                        placeholder="2028"
                        maxLength={4}
                        value={cardForm.exp_year}
                        onChange={(e) => setCardForm(prev => ({ ...prev, exp_year: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="installments">Parcelas</Label>
                      <select
                        id="installments"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                      >
                        {[1, 2, 3, 6, 12].map(num => (
                          <option key={num} value={num}>
                            {num}x de {formatPrice(totalAmount / num)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleCardPayment}
                    disabled={loading}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {loading ? 'Processando...' : `Pagar ${formatPrice(totalAmount)}`}
                  </Button>
                </TabsContent>

                <TabsContent value="pix" className="space-y-4 mt-6">
                  {!paymentResult ? (
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        Clique no botão abaixo para gerar o código PIX
                      </p>
                      <Button
                        onClick={handlePixPayment}
                        disabled={loading}
                        size="lg"
                        className="w-full"
                      >
                        {loading ? 'Gerando PIX...' : `Gerar PIX - ${formatPrice(totalAmount)}`}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-4">PIX Gerado com Sucesso!</h3>
                        
                        {paymentResult.pix_qr_code && (
                          <div className="bg-white p-4 rounded-lg inline-block mb-4">
                            <QrCode className="h-32 w-32 mx-auto" />
                            <p className="text-sm text-muted-foreground mt-2">
                              Escaneie o QR Code com seu app de banco
                            </p>
                          </div>
                        )}

                        {paymentResult.pix_copy_paste && (
                          <div className="space-y-2">
                            <Label>Ou copie o código:</Label>
                            <div className="flex gap-2">
                              <Input
                                value={paymentResult.pix_copy_paste}
                                readOnly
                                className="font-mono text-sm"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={copyPixCode}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="boleto" className="space-y-4 mt-6">
                  {!paymentResult ? (
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        O boleto será gerado com vencimento em 3 dias
                      </p>
                      <Button
                        onClick={handleBoletoPayment}
                        disabled={loading}
                        size="lg"
                        className="w-full"
                      >
                        {loading ? 'Gerando Boleto...' : `Gerar Boleto - ${formatPrice(totalAmount)}`}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold">Boleto Gerado!</h3>
                      <p className="text-muted-foreground">
                        Clique no link abaixo para visualizar e imprimir seu boleto
                      </p>
                      {paymentResult.boleto_url && (
                        <Button
                          onClick={() => window.open(paymentResult.boleto_url, '_blank')}
                          className="w-full"
                        >
                          Abrir Boleto
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Moto:</span>
                  <span>{rentalState.selectedBike?.bike_models?.brand} {rentalState.selectedBike?.bike_models?.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Plano:</span>
                  <span>{rentalState.selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Loja:</span>
                  <span>{rentalState.selectedStore?.name}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  🔒 Pagamento seguro processado pela Pagar.me
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
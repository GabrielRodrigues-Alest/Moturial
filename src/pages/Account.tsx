import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, History, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { use2FA } from '@/hooks/use2FA';
import { queries } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Account: React.FC = () => {
  const { user, signOut } = useAuth();
  const { loading: twoFALoading, verified, send2FA, verify2FA, reset2FA } = use2FA();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'whatsapp' | 'email'>('whatsapp');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserRentals();
    }
  }, [user]);

  const loadUserRentals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await queries.getUserRentals(user.id);
      if (error) throw error;
      setRentals(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico",
        variant: "destructive"
      });
    } finally {
      setLoadingRentals(false);
    }
  };

  const handleSend2FA = async () => {
    const { error } = await send2FA(selectedChannel);
    if (!error) {
      // Code sent successfully
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite o código de verificação",
        variant: "destructive"
      });
      return;
    }

    const { error } = await verify2FA(verificationCode);
    if (!error) {
      setVerificationCode('');
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      reserved: { label: 'Reservado', variant: 'default' as const },
      active: { label: 'Ativo', variant: 'default' as const },
      completed: { label: 'Concluído', variant: 'outline' as const },
      canceled: { label: 'Cancelado', variant: 'destructive' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Você precisa estar logado para acessar sua conta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Minha Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e histórico de aluguéis
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Seus dados pessoais e informações de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ''} disabled />
                </div>
                <div>
                  <Label>Data de Cadastro</Label>
                  <Input 
                    value={new Date(user.created_at).toLocaleDateString('pt-BR')} 
                    disabled 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" onClick={() => signOut()}>
                  Sair da Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">2FA Ativado</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Sua conta está protegida com autenticação de dois fatores.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={reset2FA}
                    className="mt-3"
                  >
                    Reconfigurar 2FA
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Escolha o método de verificação:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <Button
                        variant={selectedChannel === 'whatsapp' ? 'default' : 'outline'}
                        onClick={() => setSelectedChannel('whatsapp')}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </Button>
                      <Button
                        variant={selectedChannel === 'sms' ? 'default' : 'outline'}
                        onClick={() => setSelectedChannel('sms')}
                        className="flex items-center gap-2"
                      >
                        <Smartphone className="h-4 w-4" />
                        SMS
                      </Button>
                      <Button
                        variant={selectedChannel === 'email' ? 'default' : 'outline'}
                        onClick={() => setSelectedChannel('email')}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSend2FA}
                      disabled={twoFALoading}
                      variant="outline"
                    >
                      {twoFALoading ? 'Enviando...' : 'Enviar Código'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label>Código de Verificação:</Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Digite o código de 6 dígitos"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button
                        onClick={handleVerify2FA}
                        disabled={twoFALoading || !verificationCode.trim()}
                      >
                        {twoFALoading ? 'Verificando...' : 'Verificar'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Aluguéis</CardTitle>
              <CardDescription>
                Todos os seus aluguéis de motocicletas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRentals ? (
                <div className="text-center py-8">Carregando histórico...</div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Você ainda não possui aluguéis.
                </div>
              ) : (
                <div className="space-y-4">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">
                          {rental.bikes?.bike_models?.brand} {rental.bikes?.bike_models?.model}
                        </h3>
                        {getStatusBadge(rental.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p><strong>Loja:</strong> {rental.stores?.name}</p>
                          <p><strong>Plano:</strong> {rental.rental_plans?.name}</p>
                          <p><strong>Período:</strong> {new Date(rental.start_at).toLocaleDateString('pt-BR')} - {new Date(rental.end_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <p><strong>Valor:</strong> {formatPrice(rental.price_cents)}</p>
                          {rental.invoices && rental.invoices.length > 0 && (
                            <p><strong>Pagamento:</strong> {getStatusBadge(rental.invoices[0].status)}</p>
                          )}
                          <p><strong>Data:</strong> {new Date(rental.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
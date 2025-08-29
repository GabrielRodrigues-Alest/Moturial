import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, User } from 'lucide-react';
import { useRental } from '@/contexts/RentalContext';

interface SuccessProps {
  onNavigate: (page: string) => void;
}

const Success: React.FC<SuccessProps> = ({ onNavigate }) => {
  const { rentalState, clearRentalState } = useRental();

  const handleGoHome = () => {
    clearRentalState();
    onNavigate('home');
  };

  const handleGoToAccount = () => {
    clearRentalState();
    onNavigate('account');
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Pagamento Aprovado!
          </h1>
          <p className="text-lg text-muted-foreground">
            Sua reserva foi confirmada com sucesso
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Detalhes da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rentalState.selectedBike && rentalState.selectedStore && rentalState.selectedPlan && (
              <div className="space-y-3">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    {rentalState.selectedBike.bike_models?.brand} {rentalState.selectedBike.bike_models?.model}
                  </h3>
                  <p className="text-muted-foreground capitalize">
                    Cor: {rentalState.selectedBike.color}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Loja para Retirada:</strong>
                    <p>{rentalState.selectedStore.name}</p>
                    <p className="text-muted-foreground">
                      {rentalState.selectedStore.address}<br />
                      {rentalState.selectedStore.city}, {rentalState.selectedStore.state}
                    </p>
                  </div>
                  <div>
                    <strong>Plano Selecionado:</strong>
                    <p>{rentalState.selectedPlan.name}</p>
                    <p className="text-muted-foreground">
                      {rentalState.selectedPlan.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                📋 Próximos Passos:
              </h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Você receberá um email com os detalhes</li>
                <li>2. Dirija-se à loja na data agendada</li>
                <li>3. Leve seus documentos (RG, CNH, CPF)</li>
                <li>4. Retire sua motocicleta e aproveite!</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Importante:
              </h4>
              <p className="text-sm text-yellow-700">
                Guarde o comprovante de pagamento. Você precisará apresentá-lo na loja junto com seus documentos.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoToAccount}
            variant="outline"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Ver Minha Conta
          </Button>
          
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
import { apiClient } from '@/lib/api';

// Tipos para integração com o backend Java
export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'CARD' | 'PIX' | 'BOLETO';
  installments?: number;
  description?: string;
  customer: {
    name: string;
    email: string;
    document?: string;
    phone?: string;
  };
  card?: {
    number: string;
    holderName: string;
    expiryDate: string;
    cvv: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  externalId: string;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'ERROR' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  amount: number;
  currency: string;
  paymentMethod: 'CARD' | 'PIX' | 'BOLETO';
  installments?: number;
  description?: string;
  errorMessage?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  metadata?: Record<string, string>;
}

// Note: Authentication is now handled by the apiClient

// API de pagamentos - now using centralized apiClient
export const paymentApi = {
  /**
   * Processa pagamento com cartão
   */
  async processCardPayment(request: PaymentRequest): Promise<PaymentResult> {
    return apiClient.post('/payments/card', request);
  },

  /**
   * Processa pagamento via PIX
   */
  async processPixPayment(request: PaymentRequest): Promise<PaymentResult> {
    return apiClient.post('/payments/pix', request);
  },

  /**
   * Consulta status de um pagamento
   */
  async getPaymentStatus(externalId: string): Promise<PaymentResult> {
    return apiClient.get(`/payments/${externalId}/status`);
  },

  /**
   * Cancela um pagamento
   */
  async cancelPayment(externalId: string): Promise<PaymentResult> {
    return apiClient.post(`/payments/${externalId}/cancel`);
  },

  /**
   * Lista pagamentos de um usuário
   */
  async getUserPayments(userId: string): Promise<any[]> {
    return apiClient.get(`/payments/user/${userId}`);
  },

  /**
   * Health check do serviço
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiClient.get('/actuator/health');
  },
};

// Utilitários para validação
export const paymentValidation = {
  /**
   * Valida número de cartão usando algoritmo de Luhn
   */
  isValidCardNumber(number: string): boolean {
    const cleanNumber = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }

    let sum = 0;
    let alternate = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cleanNumber.substring(i, i + 1));
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      sum += n;
      alternate = !alternate;
    }
    
    return sum % 10 === 0;
  },

  /**
   * Valida data de expiração
   */
  isValidExpiryDate(expiryDate: string): boolean {
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();

    return expiry > now;
  },

  /**
   * Valida CVV
   */
  isValidCvv(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  },

  /**
   * Formata número de cartão para exibição
   */
  formatCardNumber(number: string): string {
    const cleanNumber = number.replace(/\s/g, '');
    const groups = cleanNumber.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleanNumber;
  },

  /**
   * Mascara número de cartão para segurança
   */
  maskCardNumber(number: string): string {
    if (number.length < 4) return number;
    return '**** **** **** ' + number.slice(-4);
  },
};

// Constantes para cartões de teste Stripe
export const STRIPE_TEST_CARDS = {
  VISA: '4242424242424242',
  MASTERCARD: '5555555555554444',
  AMEX: '378282246310005',
  ERROR_CARD: '4000000000000002',
  INSUFFICIENT_FUNDS: '4000000000009995',
  DECLINED: '4000000000000002',
  EXPIRED: '4000000000000069',
  INCORRECT_CVC: '4000000000000127',
} as const;

// Hook para pagamentos
export const usePayment = () => {
  const processPayment = async (request: PaymentRequest) => {
    try {
      switch (request.paymentMethod) {
        case 'CARD':
          return await paymentApi.processCardPayment(request);
        case 'PIX':
          return await paymentApi.processPixPayment(request);
        default:
          throw new Error(`Método de pagamento não suportado: ${request.paymentMethod}`);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  };

  const checkPaymentStatus = async (externalId: string) => {
    try {
      return await paymentApi.getPaymentStatus(externalId);
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  };

  const cancelPayment = async (externalId: string) => {
    try {
      return await paymentApi.cancelPayment(externalId);
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      throw error;
    }
  };

  return {
    processPayment,
    checkPaymentStatus,
    cancelPayment,
    validation: paymentValidation,
    testCards: STRIPE_TEST_CARDS,
  };
};

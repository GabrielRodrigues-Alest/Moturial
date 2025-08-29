import { requireEnv } from './utils.ts';

const PAGARME_API_KEY = requireEnv('PAGARME_API_KEY');
const PAGARME_API_BASE = Deno.env.get('PAGARME_API_BASE') || 'https://api.pagar.me/core/v5';

interface CustomerData {
  name: string;
  email: string;
  document?: string;
  document_type?: string;
  phones?: {
    mobile_phone: {
      country_code: string;
      area_code: string;
      number: string;
    };
  };
}

interface CreateOrderChargeCardTokenParams {
  amount_cents: number;
  description: string;
  card_token: string;
  customer: CustomerData;
  metadata?: Record<string, any>;
  installments?: number;
}

interface CreateOrderChargePixParams {
  amount_cents: number;
  description: string;
  customer: CustomerData;
  metadata?: Record<string, any>;
}

interface CreateOrderChargeBoletoParams {
  amount_cents: number;
  description: string;
  customer: CustomerData;
  due_at: string;
  metadata?: Record<string, any>;
}

async function pagarmeRequest(endpoint: string, data: any) {
  const response = await fetch(`${PAGARME_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(PAGARME_API_KEY + ':')}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pagar.me API error: ${response.status} ${error}`);
  }

  return await response.json();
}

export async function createOrderChargeCardToken(params: CreateOrderChargeCardTokenParams) {
  const orderData = {
    items: [{
      description: params.description,
      quantity: 1,
      amount: params.amount_cents
    }],
    payments: [{
      payment_method: 'credit_card',
      credit_card: {
        operation_type: 'auth_and_capture',
        installments: params.installments || 1,
        statement_descriptor: 'MOTOS RENTAL',
        card: {
          token: params.card_token
        }
      }
    }],
    customer: params.customer,
    metadata: params.metadata || {}
  };

  return await pagarmeRequest('/orders', orderData);
}

export async function createOrderChargePix(params: CreateOrderChargePixParams) {
  const orderData = {
    items: [{
      description: params.description,
      quantity: 1,
      amount: params.amount_cents
    }],
    payments: [{
      payment_method: 'pix',
      pix: {
        expires_in: 3600 // 1 hour
      }
    }],
    customer: params.customer,
    metadata: params.metadata || {}
  };

  return await pagarmeRequest('/orders', orderData);
}

export async function createOrderChargeBoleto(params: CreateOrderChargeBoletoParams) {
  const orderData = {
    items: [{
      description: params.description,
      quantity: 1,
      amount: params.amount_cents
    }],
    payments: [{
      payment_method: 'boleto',
      boleto: {
        due_at: params.due_at,
        instructions: 'Pagamento referente ao aluguel de motocicleta'
      }
    }],
    customer: params.customer,
    metadata: params.metadata || {}
  };

  return await pagarmeRequest('/orders', orderData);
}
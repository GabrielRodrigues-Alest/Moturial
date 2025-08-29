import { supabase } from '@/integrations/supabase/client';

// API wrapper functions for Edge Functions
export const api = {
  // 2FA functions
  send2FA: async (userId: string, channel: 'sms' | 'whatsapp' | 'email') => {
    return await supabase.functions.invoke('2fa-send', {
      body: { user_id: userId, channel }
    });
  },

  verify2FA: async (userId: string, code: string) => {
    return await supabase.functions.invoke('2fa-verify', {
      body: { user_id: userId, code }
    });
  },

  // Rental functions
  quoteRental: async (rentalPlanId: string) => {
    return await supabase.functions.invoke('rentals-quote', {
      body: { rental_plan_id: rentalPlanId }
    });
  },

  createRental: async (userId: string, storeId: string, bikeId: string, rentalPlanId: string, startAt: string) => {
    return await supabase.functions.invoke('rentals-create', {
      body: { user_id: userId, store_id: storeId, bike_id: bikeId, rental_plan_id: rentalPlanId, start_at: startAt }
    });
  },

  closeRental: async (rentalId: string, kmEnd: number) => {
    return await supabase.functions.invoke('rentals-close', {
      body: { rental_id: rentalId, km_end: kmEnd }
    });
  },

  // Payment functions
  createPayment: async (params: {
    ref_type: 'rental' | 'accessory';
    ref_id: string;
    method: 'card' | 'pix' | 'boleto';
    card_token?: string;
    installments?: number;
    due_at?: string;
    customer: {
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
    };
  }) => {
    return await supabase.functions.invoke('payments-create', {
      body: params
    });
  }
};

// Data fetching functions
export const queries = {
  // Get stores
  getStores: async () => {
    return await supabase
      .from('stores')
      .select(`
        *,
        franchises:franchise_id (
          *,
          orgs:org_id (*)
        )
      `)
      .eq('active', true)
      .order('name');
  },

  // Get bikes for a store (secure - no sensitive data)
  getBikesPublic: async () => {
    return await supabase.rpc('get_available_bikes_public');
  },

  // Get bikes for a store (authenticated users only - full data)
  getBikes: async (storeId: string) => {
    return await supabase
      .from('bikes')
      .select(`
        *,
        bike_models (*)
      `)
      .eq('store_id', storeId)
      .eq('status', 'available')
      .order('created_at');
  },

  // Get bike models
  getBikeModels: async () => {
    return await supabase
      .from('bike_models')
      .select('*')
      .eq('active', true)
      .order('brand', { ascending: true });
  },

  // Get rental plans
  getRentalPlans: async () => {
    return await supabase
      .from('rental_plans')
      .select('*')
      .eq('active', true)
      .order('base_price_cents');
  },

  // Get user rentals
  getUserRentals: async (userId: string) => {
    return await supabase
      .from('rentals')
      .select(`
        *,
        bikes (*,
          bike_models (*)
        ),
        stores (*),
        rental_plans (*),
        invoices (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  // Get accessories
  getAccessories: async () => {
    return await supabase
      .from('accessories')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true });
  }
};
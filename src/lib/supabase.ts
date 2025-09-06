/**
 * Legacy Supabase API Replacement
 * 
 * This module provides compatibility layer for components that previously
 * used Supabase, now redirecting to the Spring Boot backend.
 * 
 * @deprecated Use @/lib/api directly instead
 * @author Moturial Team
 * @version 1.0.0
 */

import { apiClient, paymentApi as newPaymentApi } from '@/lib/api';

/**
 * Legacy API object for backward compatibility
 * @deprecated Use authApi, paymentApi from @/lib/api instead
 */
export const api = {
  /**
   * @deprecated Use authApi.sendWhatsAppCode instead
   */
  async send2FA(userId: string, channel: 'sms' | 'whatsapp' | 'email') {
    throw new Error('Use authApi.sendWhatsAppCode from @/lib/api instead');
  },

  /**
   * @deprecated Use authApi.verifyWhatsAppCode instead
   */
  async verify2FA(userId: string, code: string) {
    throw new Error('Use authApi.verifyWhatsAppCode from @/lib/api instead');
  },

  /**
   * @deprecated Use paymentApi from @/lib/api instead
   */
  async processPayment(paymentData: any) {
    throw new Error('Use paymentApi from @/lib/api instead');
  }
};

/**
 * Legacy queries object for backward compatibility
 * @deprecated Use specific API functions from @/lib/api instead
 */
export const queries = {
  /**
   * Get motorcycles data
   * @deprecated Implement in backend and use apiClient
   */
  motorcycles: {
    queryKey: ['motorcycles'],
    queryFn: async () => {
      // Mock data for now - should be implemented in backend
      return [
        {
          id: '1',
          name: 'Honda CG 160',
          type: 'Street',
          engine: '160cc',
          fuel: 'Flex',
          year: 2024,
          available: true,
          pricePerDay: 45.00,
          location: 'São Paulo - SP'
        },
        {
          id: '2',
          name: 'Honda Bros 160',
          type: 'Adventure',
          engine: '160cc',
          fuel: 'Flex',
          year: 2024,
          available: true,
          pricePerDay: 55.00,
          location: 'São Paulo - SP'
        },
        {
          id: '3',
          name: 'Suzuki DR 160',
          type: 'Off-road',
          engine: '160cc',
          fuel: 'Flex',
          year: 2024,
          available: true,
          pricePerDay: 50.00,
          location: 'São Paulo - SP'
        }
      ];
    }
  },

  /**
   * Get stores data
   * @deprecated Implement in backend and use apiClient
   */
  stores: {
    queryKey: ['stores'],
    queryFn: async () => {
      // Mock data for now - should be implemented in backend
      return [
        {
          id: '1',
          name: 'Moturial Centro',
          address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
          phone: '(11) 3333-4444',
          coordinates: { lat: -23.5505, lng: -46.6333 },
          available: true
        },
        {
          id: '2',
          name: 'Moturial Vila Madalena',
          address: 'Rua Harmonia, 456 - Vila Madalena, São Paulo - SP',
          phone: '(11) 5555-6666',
          coordinates: { lat: -23.5489, lng: -46.6888 },
          available: true
        }
      ];
    }
  },

  /**
   * Get rental plans
   * @deprecated Implement in backend and use apiClient
   */
  plans: {
    queryKey: ['plans'],
    queryFn: async () => {
      // Mock data for now - should be implemented in backend
      return [
        {
          id: '1',
          name: 'Plano Diário',
          duration: '1 dia',
          price: 45.00,
          description: 'Perfeito para passeios rápidos',
          features: ['Seguro incluso', 'Capacete grátis', 'Suporte 24h']
        },
        {
          id: '2',
          name: 'Plano Semanal',
          duration: '7 dias',
          price: 280.00,
          description: 'Ideal para uma semana de aventuras',
          features: ['Seguro incluso', 'Capacete grátis', 'Suporte 24h', 'Desconto de 12%']
        },
        {
          id: '3',
          name: 'Plano Mensal',
          duration: '30 dias',
          price: 1050.00,
          description: 'Para quem precisa de mobilidade constante',
          features: ['Seguro incluso', 'Capacete grátis', 'Suporte 24h', 'Desconto de 22%', 'Manutenção inclusa']
        }
      ];
    }
  },

  /**
   * Get accessories
   * @deprecated Implement in backend and use apiClient
   */
  accessories: {
    queryKey: ['accessories'],
    queryFn: async () => {
      // Mock data for now - should be implemented in backend
      return [
        {
          id: '1',
          name: 'Capacete Fechado',
          price: 15.00,
          description: 'Capacete de segurança premium',
          category: 'Segurança'
        },
        {
          id: '2',
          name: 'Baú Traseiro',
          price: 10.00,
          description: 'Baú para transporte de objetos',
          category: 'Transporte'
        },
        {
          id: '3',
          name: 'Capa de Chuva',
          price: 8.00,
          description: 'Proteção contra chuva',
          category: 'Proteção'
        }
      ];
    }
  },

  /**
   * Get user rentals
   * @deprecated Implement in backend and use apiClient
   */
  userRentals: {
    queryKey: ['userRentals'],
    queryFn: async (userId: string) => {
      // Mock data for now - should be implemented in backend
      return [
        {
          id: '1',
          motorcycleId: '1',
          motorcycleName: 'Honda CG 160',
          startDate: '2024-01-15',
          endDate: '2024-01-16',
          status: 'completed',
          totalAmount: 45.00
        }
      ];
    }
  },

  /**
   * Get dashboard stats
   * @deprecated Implement in backend and use apiClient
   */
  dashboardStats: {
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Mock data for now - should be implemented in backend
      return {
        totalRentals: 150,
        activeRentals: 25,
        totalRevenue: 15750.00,
        availableMotorcycles: 45
      };
    }
  }
};

/**
 * Legacy payment API for backward compatibility
 * @deprecated Use paymentApi from @/lib/api instead
 */
export const paymentApi = {
  /**
   * @deprecated Use paymentApi.createPayment from @/lib/api instead
   */
  async processPayment(paymentData: any) {
    return newPaymentApi.createPayment(paymentData);
  },

  /**
   * @deprecated Use paymentApi.getPayment from @/lib/api instead
   */
  async getPaymentStatus(paymentId: string) {
    return newPaymentApi.getPayment(paymentId);
  }
};

// Export default for backward compatibility
export default {
  api,
  queries,
  paymentApi
};

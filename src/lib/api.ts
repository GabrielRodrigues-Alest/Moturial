/**
 * API Client for Moturial Spring Boot Backend
 * 
 * This module provides a centralized API client for communicating with the
 * Spring Boot backend, replacing Supabase functionality.
 * 
 * @author Moturial Team
 * @version 1.0.0
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const API_KEY = (import.meta as any).env?.VITE_API_KEY || 'moturial-secret-key-dev-5a7b9c1d2e3f4g5h6j7k8l9m0n1o2p3q';

/**
 * API Response interface
 */
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * HTTP Client with authentication and error handling
 */
class ApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-API-KEY': this.apiKey,
      'Accept': 'application/json',
    };
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode = response.status.toString();

      if (contentType?.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorCode = errorData.code || errorCode;
        } catch {
          // If JSON parsing fails, use default error message
        }
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return data.data || data;
    }

    return response.text() as unknown as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL, API_KEY);

/**
 * User interfaces
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: string[];
  memberships: UserMembership[];
  createdAt: string;
  updatedAt: string;
}

export interface UserMembership {
  orgId?: string;
  franchiseId?: string;
  storeId?: string;
  role: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Sign up new user
   */
  async signUp(email: string, password: string, fullName: string, phone: string): Promise<{ user: User; session: Session }> {
    return apiClient.post('/auth/signup', {
      email,
      password,
      fullName,
      phone
    });
  },

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<{ user: User; session: Session }> {
    return apiClient.post('/auth/signin', {
      email,
      password
    });
  },

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    return apiClient.post('/auth/signout');
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me');
  },

  /**
   * Send WhatsApp verification code
   */
  async sendWhatsAppCode(phone: string): Promise<void> {
    return apiClient.post('/auth/2fa/send-whatsapp', { phone });
  },

  /**
   * Verify WhatsApp code
   */
  async verifyWhatsAppCode(phone: string, code: string): Promise<void> {
    return apiClient.post('/auth/2fa/verify-whatsapp', { phone, code });
  }
};

/**
 * Payment interfaces
 */
export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: 'CARD' | 'PIX' | 'BOLETO';
  installments: number;
  description?: string;
  customerData: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  cardData?: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    holderName: string;
  };
  addressData: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Payment {
  id: string;
  externalId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  installments: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

/**
 * Payment API
 */
export const paymentApi = {
  /**
   * Create payment
   */
  async createPayment(paymentRequest: PaymentRequest): Promise<Payment> {
    return apiClient.post('/payments', paymentRequest);
  },

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment> {
    return apiClient.get(`/payments/${paymentId}`);
  },

  /**
   * Get user payments
   */
  async getUserPayments(userId: string, page = 0, size = 20): Promise<{ content: Payment[]; totalElements: number }> {
    return apiClient.get('/payments', { 
      userId, 
      page: page.toString(), 
      size: size.toString() 
    });
  }
};

/**
 * Health check API
 */
export const healthApi = {
  /**
   * Check API health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return apiClient.get('/actuator/health');
  }
};

export default apiClient;

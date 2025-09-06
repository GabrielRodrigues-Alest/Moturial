import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, Session, authApi, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: string[];
  memberships: Array<{
    orgId: string | null;
    franchiseId: string | null;
    storeId: string | null;
    role: string;
  }>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendWhatsAppCode: (phone: string) => Promise<{ error: any }>;
  verifyWhatsAppCode: (phone: string, code: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<AuthContextType['memberships']>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const user = await authApi.getCurrentUser();
          setUser(user);
          const session = {
            user,
            token,
            expiresAt: localStorage.getItem('auth_expires') || ''
          };
          setSession(session);
        }
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_expires');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load memberships/roles whenever user changes
  useEffect(() => {
    if (!user) {
      setMemberships([]);
      return;
    }

    // Use memberships from user object (loaded from backend)
    const userMemberships = user.memberships.map(m => ({
      orgId: m.orgId ?? null,
      franchiseId: m.franchiseId ?? null,
      storeId: m.storeId ?? null,
      role: m.role
    }));
    
    setMemberships(userMemberships);
  }, [user]);

  const roles = useMemo(() => Array.from(new Set(memberships.map(m => m.role))), [memberships]);
  const hasRole = (role: string) => roles.includes(role);
  const isAdmin = hasRole('admin');

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const { user, session } = await authApi.signUp(email, password, fullName, phone);
      
      // Store session
      localStorage.setItem('auth_token', session.token);
      localStorage.setItem('auth_expires', session.expiresAt);
      
      setUser(user);
      setSession(session);
      
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Moturial!"
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.message : 'Erro no cadastro';
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user, session } = await authApi.signIn(email, password);
      
      // Store session
      localStorage.setItem('auth_token', session.token);
      localStorage.setItem('auth_expires', session.expiresAt);
      
      setUser(user);
      setSession(session);
      
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${user.fullName}!`
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.message : 'Erro no login';
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
      
      // Clear session
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_expires');
      
      setUser(null);
      setSession(null);
      setMemberships([]);
      
      toast({
        title: "Logout realizado",
        description: "Até logo!"
      });
    } catch (error: any) {
      // Clear session even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_expires');
      setUser(null);
      setSession(null);
      setMemberships([]);
      
      const errorMessage = error instanceof ApiError ? error.message : 'Erro ao sair';
      toast({
        title: "Erro ao sair",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const sendWhatsAppCode = async (phone: string) => {
    try {
      await authApi.sendWhatsAppCode(phone);
      
      toast({
        title: "Código enviado!",
        description: "Verifique seu WhatsApp para o código de verificação."
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.message : 'Erro ao enviar código';
      toast({
        title: "Erro ao enviar código",
        description: errorMessage,
        variant: "destructive"
      });
      return { error };
    }
  };

  const verifyWhatsAppCode = async (phone: string, code: string) => {
    try {
      await authApi.verifyWhatsAppCode(phone, code);
      
      toast({
        title: "Código verificado!",
        description: "2FA ativado com sucesso."
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.message : 'Código inválido';
      toast({
        title: "Erro na verificação",
        description: errorMessage,
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    roles,
    memberships,
    hasRole,
    isAdmin,
    signUp,
    signIn,
    signOut,
    sendWhatsAppCode,
    verifyWhatsAppCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
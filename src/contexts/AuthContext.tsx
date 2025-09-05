import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: string[];
  memberships: Array<{
    org_id: string | null;
    franchise_id: string | null;
    store_id: string | null;
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load memberships/roles whenever user changes
  useEffect(() => {
    const loadMemberships = async () => {
      if (!user) {
        setMemberships([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('org_members')
          .select('org_id, franchise_id, store_id, role')
          .eq('user_id', user.id)
          .eq('active', true);
        if (error) throw error;
        setMemberships((data ?? []).map((m: any) => ({
          org_id: m.org_id ?? null,
          franchise_id: m.franchise_id ?? null,
          store_id: m.store_id ?? null,
          role: String(m.role)
        })));
      } catch (err: any) {
        setMemberships([]);
        toast({
          title: 'Erro ao carregar permissões',
          description: err?.message ?? 'Falha ao consultar permissões do usuário.',
          variant: 'destructive'
        });
      }
    };
    void loadMemberships();
  }, [user, toast]);

  const roles = useMemo(() => Array.from(new Set(memberships.map(m => m.role))), [memberships]);
  const hasRole = (role: string) => roles.includes(role);
  const isAdmin = hasRole('admin');

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendWhatsAppCode = async (phone: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-whatsapp-code', {
        body: { phone }
      });

      if (error) {
        toast({
          title: "Erro ao enviar código",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Código enviado!",
          description: "Verifique seu WhatsApp para o código de verificação."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Erro ao enviar código",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const verifyWhatsAppCode = async (phone: string, code: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-whatsapp-code', {
        body: { phone, code }
      });

      if (error) {
        toast({
          title: "Código inválido",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Código verificado!",
          description: "2FA ativado com sucesso."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Erro na verificação",
        description: error.message,
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
import { useState } from 'react';
import { api } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const use2FA = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const send2FA = async (channel: 'sms' | 'whatsapp' | 'email') => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await api.send2FA(user.id, channel);
      if (error) throw error;

      toast({
        title: "Código Enviado",
        description: `Código de verificação enviado via ${channel}`,
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o código",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (code: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await api.verify2FA(user.id, code);
      if (error) throw error;

      setVerified(true);
      
      toast({
        title: "Verificado!",
        description: "Código verificado com sucesso",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Código Inválido",
        description: error.message || "Código inválido ou expirado",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const reset2FA = () => {
    setVerified(false);
  };

  return {
    loading,
    verified,
    send2FA,
    verify2FA,
    reset2FA
  };
};
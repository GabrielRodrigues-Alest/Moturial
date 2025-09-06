import { useState } from 'react';
import { authApi } from '@/lib/api';
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
      if (channel === 'whatsapp') {
        await authApi.sendWhatsAppCode(user.phone || '');
      } else {
        // For SMS and email, we'll need to implement these endpoints in the backend
        throw new Error(`Canal ${channel} não implementado ainda`);
      }

      toast({
        title: "Código Enviado",
        description: `Código de verificação enviado via ${channel}`,
      });

      return { data: true, error: null };
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
      await authApi.verifyWhatsAppCode(user.phone || '', code);

      setVerified(true);
      
      toast({
        title: "Verificado!",
        description: "Código verificado com sucesso",
      });

      return { data: true, error: null };
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
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  phone: string;
  code: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { phone, code }: RequestBody = await req.json();

    if (!phone || !code) {
      throw new Error('Phone number and code are required');
    }

    // Find the code in the database
    const { data: storedCode, error: fetchError } = await supabase
      .from('whatsapp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .single();

    if (fetchError || !storedCode) {
      console.error('Code not found or fetch error:', fetchError);
      throw new Error('Código inválido ou expirado');
    }

    // Check if code has expired
    const now = new Date();
    const expiresAt = new Date(storedCode.expires_at);
    
    if (now > expiresAt) {
      // Mark as used to prevent reuse
      await supabase
        .from('whatsapp_codes')
        .update({ used: true })
        .eq('id', storedCode.id);
        
      throw new Error('Código expirado');
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from('whatsapp_codes')
      .update({ used: true })
      .eq('id', storedCode.id);

    if (updateError) {
      console.error('Error updating code:', updateError);
      throw new Error('Erro interno do servidor');
    }

    console.log(`WhatsApp code verified successfully for ${phone}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '2FA verificado com sucesso!',
        verified: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in verify-whatsapp-code function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false,
        verified: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
})
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  phone: string;
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

    const { phone }: RequestBody = await req.json();

    if (!phone) {
      throw new Error('Phone number is required');
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 5 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Store the code in the database
    const { error: insertError } = await supabase
      .from('whatsapp_codes')
      .insert({
        phone,
        code,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (insertError) {
      console.error('Error storing WhatsApp code:', insertError);
      throw new Error('Failed to store verification code');
    }

    // In a real implementation, you would send the code via WhatsApp API
    // For demo purposes, we'll log it and simulate sending
    console.log(`WhatsApp code for ${phone}: ${code}`);
    
    // Simulate WhatsApp API call
    // In production, integrate with WhatsApp Business API or Twilio WhatsApp
    console.log('Simulating WhatsApp message send...');
    console.log(`Message sent to ${phone}: Seu código LocaGora é: ${code}. Válido por 5 minutos.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Código enviado com sucesso!',
        // In demo mode, we return the code for testing purposes
        // Remove this in production!
        demo_code: code 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-whatsapp-code function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
})
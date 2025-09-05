import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, code } = await req.json();

    if (!user_id || !code) {
      return jsonError('Missing user_id or code');
    }

    // Find valid code
    const { data: codeData, error: findError } = await supabaseAdmin
      .from('twofa_codes')
      .select('*')
      .eq('user_id', user_id)
      .eq('code', code)
      .eq('consumed', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !codeData) {
      return jsonError('Invalid or expired verification code');
    }

    // Mark code as consumed
    const { error: updateError } = await supabaseAdmin
      .from('twofa_codes')
      .update({ consumed: true })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('Failed to mark code as consumed:', updateError);
      return jsonError('Verification failed');
    }

    return json({
      message: 'Code verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('2FA verify error:', error);
    return jsonError(error.message, 500);
  }
});
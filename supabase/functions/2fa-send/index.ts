import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, channel } = await req.json();

    if (!user_id || !channel) {
      return jsonError('Missing user_id or channel');
    }

    if (!['sms', 'whatsapp', 'email'].includes(channel)) {
      return jsonError('Invalid channel. Must be sms, whatsapp, or email');
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save code to database
    const { error } = await supabaseAdmin
      .from('twofa_codes')
      .insert({
        user_id,
        channel,
        code,
        expires_at: expiresAt.toISOString(),
        consumed: false
      });

    if (error) {
      console.error('Database error:', error);
      return jsonError('Failed to save verification code');
    }

    // TODO: Integrate with SMS/WhatsApp/Email provider
    console.log(`[2FA] Code ${code} sent to user ${user_id} via ${channel}`);
    console.log(`[2FA] Demo code for testing: ${code}`);

    return json({
      message: 'Verification code sent successfully',
      // Remove this in production:
      demo_code: code
    });

  } catch (error) {
    console.error('2FA send error:', error);
    return jsonError(error.message, 500);
  }
});
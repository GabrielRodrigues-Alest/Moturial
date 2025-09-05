import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    
    console.log('Received webhook:', JSON.stringify(webhookData, null, 2));

    // TODO: Validate webhook signature if PAGARME_WEBHOOK_SECRET is set
    
    const { id: eventId, type: eventType, data } = webhookData;

    if (!eventType || !data) {
      return jsonError('Invalid webhook payload');
    }

    // Handle charge status updates
    if (eventType === 'charge.paid' || eventType === 'charge.payment_failed') {
      const chargeId = data.id;
      const status = eventType === 'charge.paid' ? 'paid' : 'failed';

      // Find invoice by gateway_payment_id
      const { data: invoice, error: findError } = await supabaseAdmin
        .from('invoices')
        .select('*, rentals(*)')
        .eq('gateway_payment_id', chargeId)
        .single();

      if (findError || !invoice) {
        console.error('Invoice not found for charge:', chargeId);
        return json({ received: true, message: 'Invoice not found' });
      }

      // Update invoice status
      const updateData: any = { status };
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error: updateError } = await supabaseAdmin
        .from('invoices')
        .update(updateData)
        .eq('id', invoice.id);

      if (updateError) {
        console.error('Failed to update invoice:', updateError);
        return jsonError('Failed to update invoice status');
      }

      // If payment was successful and it's a rental, activate it
      if (status === 'paid' && invoice.rental_id) {
        const { error: rentalUpdateError } = await supabaseAdmin
          .from('rentals')
          .update({ status: 'active' })
          .eq('id', invoice.rental_id)
          .eq('status', 'reserved'); // Only update if still reserved

        if (rentalUpdateError) {
          console.error('Failed to activate rental:', rentalUpdateError);
        } else {
          // Update bike status to rented
          const { error: bikeUpdateError } = await supabaseAdmin
            .from('bikes')
            .update({ status: 'rented' })
            .eq('id', invoice.rentals.bike_id);

          if (bikeUpdateError) {
            console.error('Failed to update bike status:', bikeUpdateError);
          }
        }
      }

      console.log(`Processed ${eventType} for invoice ${invoice.id}`);
    }

    return json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return jsonError(error.message, 500);
  }
});
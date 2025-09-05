import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';
import { createOrderChargeCardToken, createOrderChargePix, createOrderChargeBoleto } from '../_shared/pagarme.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      ref_type, 
      ref_id, 
      method, 
      card_token, 
      installments, 
      due_at, 
      customer 
    } = await req.json();

    if (!ref_type || !ref_id || !method || !customer) {
      return jsonError('Missing required parameters');
    }

    if (!['rental', 'accessory'].includes(ref_type)) {
      return jsonError('Invalid ref_type. Must be rental or accessory');
    }

    if (!['card', 'pix', 'boleto'].includes(method)) {
      return jsonError('Invalid method. Must be card, pix, or boleto');
    }

    // Get invoice details
    let invoice;
    if (ref_type === 'rental') {
      const { data, error } = await supabaseAdmin
        .from('invoices')
        .select('*, rentals(*, bikes(*, bike_models(*)))')
        .eq('rental_id', ref_id)
        .eq('status', 'pending')
        .single();
      
      if (error || !data) {
        return jsonError('Invoice not found or already processed');
      }
      invoice = data;
    } else {
      // Handle accessory orders - TODO: implement when needed
      return jsonError('Accessory orders not yet implemented');
    }

    // Prepare payment description
    const description = ref_type === 'rental' 
      ? `Aluguel ${invoice.rentals.bikes.bike_models.brand} ${invoice.rentals.bikes.bike_models.model}`
      : 'Compra de acessórios';

    let pagarmeResponse;

    try {
      switch (method) {
        case 'card':
          if (!card_token) {
            return jsonError('card_token is required for card payments');
          }
          pagarmeResponse = await createOrderChargeCardToken({
            amount_cents: invoice.amount_cents,
            description,
            card_token,
            customer,
            installments: installments || 1,
            metadata: {
              ref_type,
              ref_id,
              invoice_id: invoice.id
            }
          });
          break;

        case 'pix':
          pagarmeResponse = await createOrderChargePix({
            amount_cents: invoice.amount_cents,
            description,
            customer,
            metadata: {
              ref_type,
              ref_id,
              invoice_id: invoice.id
            }
          });
          break;

        case 'boleto':
          if (!due_at) {
            return jsonError('due_at is required for boleto payments');
          }
          pagarmeResponse = await createOrderChargeBoleto({
            amount_cents: invoice.amount_cents,
            description,
            customer,
            due_at,
            metadata: {
              ref_type,
              ref_id,
              invoice_id: invoice.id
            }
          });
          break;
      }

      // Extract payment details from Pagar.me response
      const payment = pagarmeResponse.charges[0];
      const paymentId = payment.id;
      let status = payment.status; // pending, paid, failed, etc.

      // Update invoice with payment details
      const updateData: any = {
        gateway: 'pagarme',
        gateway_payment_id: paymentId,
        payment_method: method,
        status: status === 'paid' ? 'paid' : 'pending'
      };

      if (method === 'pix' && payment.last_transaction) {
        updateData.pix_qr_code = payment.last_transaction.qr_code;
        updateData.pix_copy_paste = payment.last_transaction.qr_code_url;
      }

      if (method === 'boleto' && payment.last_transaction) {
        updateData.boleto_url = payment.last_transaction.url;
      }

      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error: updateError } = await supabaseAdmin
        .from('invoices')
        .update(updateData)
        .eq('id', invoice.id);

      if (updateError) {
        console.error('Failed to update invoice:', updateError);
        return jsonError('Payment created but failed to update invoice');
      }

      // If payment is immediately paid (like card), update rental status
      if (status === 'paid' && ref_type === 'rental') {
        await supabaseAdmin
          .from('rentals')
          .update({ status: 'active' })
          .eq('id', ref_id);

        await supabaseAdmin
          .from('bikes')
          .update({ status: 'rented' })
          .eq('id', invoice.rentals.bike_id);
      }

      return json({
        invoice_id: invoice.id,
        payment_id: paymentId,
        status,
        ...(updateData.pix_qr_code && { pix_qr_code: updateData.pix_qr_code }),
        ...(updateData.pix_copy_paste && { pix_copy_paste: updateData.pix_copy_paste }),
        ...(updateData.boleto_url && { boleto_url: updateData.boleto_url })
      });

    } catch (pagarmeError) {
      console.error('Pagar.me error:', pagarmeError);
      return jsonError(`Payment failed: ${pagarmeError.message}`);
    }

  } catch (error) {
    console.error('Payments create error:', error);
    return jsonError(error.message, 500);
  }
});
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, store_id, bike_id, rental_plan_id, start_at } = await req.json();

    if (!user_id || !store_id || !bike_id || !rental_plan_id || !start_at) {
      return jsonError('Missing required parameters');
    }

    // Check if bike is available
    const { data: bike, error: bikeError } = await supabaseAdmin
      .from('bikes')
      .select('*, bike_models(*)')
      .eq('id', bike_id)
      .eq('status', 'available')
      .single();

    if (bikeError || !bike) {
      return jsonError('Bike not available');
    }

    // Get rental plan
    const { data: plan, error: planError } = await supabaseAdmin
      .from('rental_plans')
      .select('*')
      .eq('id', rental_plan_id)
      .eq('active', true)
      .single();

    if (planError || !plan) {
      return jsonError('Rental plan not found');
    }

    // Calculate end date based on plan
    const startDate = new Date(start_at);
    const endDate = new Date(startDate);
    
    switch (plan.duration_type) {
      case 'hour':
        endDate.setHours(endDate.getHours() + plan.duration_qty);
        break;
      case 'day':
        endDate.setDate(endDate.getDate() + plan.duration_qty);
        break;
      case 'month':
        endDate.setMonth(endDate.getMonth() + plan.duration_qty);
        break;
      case 'year':
        endDate.setFullYear(endDate.getFullYear() + plan.duration_qty);
        break;
      default:
        return jsonError('Invalid duration type');
    }

    // Begin transaction
    const { data: rental, error: rentalError } = await supabaseAdmin
      .from('rentals')
      .insert({
        user_id,
        store_id,
        bike_id,
        rental_plan_id,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        status: 'reserved',
        price_cents: plan.base_price_cents,
        deposit_cents: plan.deposit_cents
      })
      .select()
      .single();

    if (rentalError) {
      console.error('Rental creation error:', rentalError);
      return jsonError('Failed to create rental');
    }

    // Update bike status to reserved
    const { error: bikeUpdateError } = await supabaseAdmin
      .from('bikes')
      .update({ status: 'reserved' })
      .eq('id', bike_id);

    if (bikeUpdateError) {
      console.error('Bike update error:', bikeUpdateError);
      // Rollback rental creation
      await supabaseAdmin.from('rentals').delete().eq('id', rental.id);
      return jsonError('Failed to reserve bike');
    }

    // Create invoice
    const totalAmount = plan.base_price_cents + (plan.deposit_cents || 0);
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .insert({
        rental_id: rental.id,
        user_id,
        amount_cents: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Invoice creation error:', invoiceError);
      // Rollback
      await supabaseAdmin.from('rentals').delete().eq('id', rental.id);
      await supabaseAdmin.from('bikes').update({ status: 'available' }).eq('id', bike_id);
      return jsonError('Failed to create invoice');
    }

    return json({
      rental_id: rental.id,
      invoice_id: invoice.id,
      amount_cents: totalAmount,
      rental_details: {
        start_at: rental.start_at,
        end_at: rental.end_at,
        bike: `${bike.bike_models.brand} ${bike.bike_models.model} (${bike.color})`,
        plan: plan.name
      }
    });

  } catch (error) {
    console.error('Rentals create error:', error);
    return jsonError(error.message, 500);
  }
});
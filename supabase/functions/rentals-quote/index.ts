import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rental_plan_id } = await req.json();

    if (!rental_plan_id) {
      return jsonError('Missing rental_plan_id');
    }

    // Get rental plan details
    const { data: plan, error } = await supabaseAdmin
      .from('rental_plans')
      .select('*')
      .eq('id', rental_plan_id)
      .eq('active', true)
      .single();

    if (error || !plan) {
      return jsonError('Rental plan not found or inactive');
    }

    // Basic pricing calculation (can be extended with price_rules)
    let price_cents = plan.base_price_cents;
    
    // TODO: Apply price_rules if any (weekend markup, seasonal pricing, etc.)
    
    return json({
      rental_plan_id,
      price_cents,
      deposit_cents: plan.deposit_cents,
      plan_details: {
        name: plan.name,
        description: plan.description,
        duration_type: plan.duration_type,
        duration_qty: plan.duration_qty
      }
    });

  } catch (error) {
    console.error('Rentals quote error:', error);
    return jsonError(error.message, 500);
  }
});
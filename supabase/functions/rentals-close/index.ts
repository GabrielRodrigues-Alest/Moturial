import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { supabaseAdmin, json, jsonError, corsHeaders } from '../_shared/supa.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rental_id, km_end } = await req.json();

    if (!rental_id || km_end === undefined) {
      return jsonError('Missing rental_id or km_end');
    }

    // Get rental details
    const { data: rental, error: rentalError } = await supabaseAdmin
      .from('rentals')
      .select('*, bikes(*)')
      .eq('id', rental_id)
      .eq('status', 'active')
      .single();

    if (rentalError || !rental) {
      return jsonError('Active rental not found');
    }

    // Update rental status to completed
    const { error: updateRentalError } = await supabaseAdmin
      .from('rentals')
      .update({
        status: 'completed',
        km_end,
        return_notes: `Returned with ${km_end}km`
      })
      .eq('id', rental_id);

    if (updateRentalError) {
      console.error('Failed to update rental:', updateRentalError);
      return jsonError('Failed to close rental');
    }

    // Update bike status to available and odometer
    const { error: updateBikeError } = await supabaseAdmin
      .from('bikes')
      .update({
        status: 'available',
        odometer: km_end
      })
      .eq('id', rental.bike_id);

    if (updateBikeError) {
      console.error('Failed to update bike:', updateBikeError);
      return jsonError('Failed to update bike status');
    }

    return json({
      message: 'Rental closed successfully',
      rental_id,
      final_odometer: km_end,
      status: 'completed'
    });

  } catch (error) {
    console.error('Rentals close error:', error);
    return jsonError(error.message, 500);
  }
});
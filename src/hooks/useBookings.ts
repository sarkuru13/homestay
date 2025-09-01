import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/accommodation';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          accommodations (
            name,
            location,
            vendor_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booking_reference' | 'status'>) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ ...booking, status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getBookingDetails = async (bookingReference: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        accommodations (
          name,
          exact_address,
          latitude,
          longitude,
          contact_number,
          vendor_id,
          vendors (
            name,
            phone
          )
        )
      `)
      .eq('booking_reference', bookingReference)
      .eq('status', 'confirmed')
      .single();

    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    getBookingDetails,
  };
}
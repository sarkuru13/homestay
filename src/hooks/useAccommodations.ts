import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Accommodation, SearchFilters } from '../types/accommodation';

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccommodations = async (filters?: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('accommodations')
        .select(`
          *,
          vendors (
            name,
            status
          )
        `)
        .eq('is_verified', true)
        .order('created_at', { ascending: false });

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.maxCapacity) {
        query = query.gte('max_capacity', filters.maxCapacity);
      }

      if (filters?.breakfastIncluded) {
        query = query.eq('breakfast_included', true);
      }

      if (filters?.lunchIncluded) {
        query = query.eq('lunch_included', true);
      }

      if (filters?.dinnerIncluded) {
        query = query.eq('dinner_included', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setAccommodations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addAccommodation = async (accommodation: Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>) => {
    // Get current vendor
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!vendor) throw new Error('Vendor not found');

    const { data, error } = await supabase
      .from('accommodations')
      .insert([{ ...accommodation, vendor_id: vendor.id, is_verified: false }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateAccommodation = async (id: string, updates: Partial<Accommodation>) => {
    const { data, error } = await supabase
      .from('accommodations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteAccommodation = async (id: string) => {
    const { error } = await supabase
      .from('accommodations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const fetchAllAccommodations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select(`
          *,
          vendors (
            name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAccommodations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const verifyAccommodation = async (id: string, isVerified: boolean) => {
    const { data, error } = await supabase
      .from('accommodations')
      .update({ is_verified: isVerified })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('accommodation-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('accommodation-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  return {
    accommodations,
    loading,
    error,
    fetchAccommodations,
    addAccommodation,
    updateAccommodation,
    deleteAccommodation,
    uploadImage,
    fetchAllAccommodations,
    verifyAccommodation,
  };
}
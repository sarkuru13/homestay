import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vendor } from '../types/accommodation';

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setVendors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const registerVendor = async (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { data, error } = await supabase
      .from('vendors')
      .insert([{ ...vendor, status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateVendorStatus = async (id: string, status: Vendor['status']) => {
    const { data, error } = await supabase
      .from('vendors')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getCurrentVendor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    registerVendor,
    updateVendorStatus,
    getCurrentVendor,
  };
}
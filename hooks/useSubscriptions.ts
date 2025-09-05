import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key';
};

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];

export function useSubscriptions(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    if (!userId) return;

    // Skip if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('renewal_date', { ascending: true });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async (subscription: Omit<SubscriptionInsert, 'user_id'>) => {
    if (!userId) return { error: 'User not authenticated' };

    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase is not configured. Please set up your Supabase project.' };
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{ ...subscription, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setSubscriptions(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subscription';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase is not configured. Please set up your Supabase project.' };
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setSubscriptions(prev => prev.map(sub => sub.id === id ? data : sub));
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteSubscription = async (id: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase is not configured. Please set up your Supabase project.' };
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subscription';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refetch: fetchSubscriptions,
  };
}
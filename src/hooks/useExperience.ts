import { useState, useEffect } from 'react';
import { supabase, type Experience } from '@/lib/supabase';

export const useExperience = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      setExperience(data || []);
    } catch (error) {
      console.error('Error fetching experience:', error);
      setError('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  return { experience, loading, error, refetch: fetchExperience };
};

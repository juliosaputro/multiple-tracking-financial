import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useCategories = (user, toast, tableName) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!user || !tableName) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast({ title: `Error fetching categories from ${tableName}`, description: error.message, variant: 'destructive' });
    } else {
      setCategories(data);
    }
    setLoading(false);
  }, [user, toast, tableName]);

  const addCategory = async (category) => {
    if (!user || !tableName) return;
    setLoading(true);
    const { error } = await supabase.from(tableName).insert({ ...category, user_id: user.id });
    if (error) {
      toast({ title: `Error adding category to ${tableName}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const updateCategory = async (id, updatedCategory) => {
    if (!tableName) return;
    setLoading(true);
    const { error } = await supabase.from(tableName).update(updatedCategory).eq('id', id);
    if (error) {
      toast({ title: `Error updating category in ${tableName}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const deleteCategory = async (id) => {
    if (!tableName) return;
    setLoading(true);
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      toast({ title: `Error deleting category from ${tableName}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return {
    categories,
    setCategories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
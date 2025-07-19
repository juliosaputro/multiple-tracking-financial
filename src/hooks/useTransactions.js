import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useTransactions = (user, toast, transactionsTable, categoriesTable) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user || !transactionsTable || !categoriesTable) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(transactionsTable)
      .select(`*, category:${categoriesTable}(name, color)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      toast({ title: `Error fetching transactions from ${transactionsTable}`, description: error.message, variant: 'destructive' });
      setTransactions([]);
    } else {
      const formattedData = data.map(t => ({
        ...t,
        categoryName: t.category?.name || 'Uncategorized',
        categoryColor: t.category?.color || '#6b7280'
      }));
      setTransactions(formattedData);
    }
    setLoading(false);
  }, [user, toast, transactionsTable, categoriesTable]);

  const addTransaction = async (transaction, categoryId) => {
    if (!user || !transactionsTable) return;
    setLoading(true);
    const { data, error } = await supabase.from(transactionsTable).insert({
      description: transaction.description,
      amount: parseInt(transaction.amount),
      date: transaction.date,
      type: transaction.type,
      user_id: user.id,
      category_id: categoryId,
    }).select();

    if (error) {
      toast({ title: `Error adding transaction to ${transactionsTable}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
    return { data, error };
  };

  const updateTransaction = async (id, updatedTransaction, categoryId) => {
    if (!transactionsTable) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(transactionsTable)
      .update({ 
        description: updatedTransaction.description,
        amount: parseInt(updatedTransaction.amount),
        date: updatedTransaction.date,
        type: updatedTransaction.type,
        category_id: categoryId 
      })
      .eq('id', id)
      .select();

    if (error) {
      toast({ title: `Error updating transaction in ${transactionsTable}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
    return { data, error };
  };

  const deleteTransaction = async (id) => {
    if (!transactionsTable) return;
    setLoading(true);
    const { error } = await supabase.from(transactionsTable).delete().eq('id', id);
    if (error) {
      toast({ title: `Error deleting transaction from ${transactionsTable}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
    return { error };
  };

  return {
    transactions,
    setTransactions,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
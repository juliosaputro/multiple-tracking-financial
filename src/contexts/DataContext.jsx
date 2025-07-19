import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useDataProcessing } from '@/hooks/useDataProcessing';
import { generateDummyData } from '@/lib/dummyData';
import { formatCurrency, formatDate } from '@/lib/utils';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children, walletId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const cleanWalletId = walletId.replace('-', '_');
  const transactionsTable = `${cleanWalletId}_transactions`;
  const categoriesTable = `${cleanWalletId}_categories`;

  const {
    transactions,
    setTransactions,
    loading: transactionsLoading,
    fetchTransactions,
    addTransaction: addTransactionHook,
    updateTransaction: updateTransactionHook,
    deleteTransaction: deleteTransactionHook,
  } = useTransactions(user, toast, transactionsTable, categoriesTable);

  const {
    categories,
    setCategories,
    loading: categoriesLoading,
    fetchCategories,
    addCategory: addCategoryHook,
    updateCategory: updateCategoryHook,
    deleteCategory: deleteCategoryHook,
  } = useCategories(user, toast, categoriesTable);

  const { getFilteredData } = useDataProcessing(transactions);

  const setupData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    // await generateDummyData(user, toast, transactionsTable, categoriesTable);
    await Promise.all([fetchCategories(), fetchTransactions()]);
    setLoading(false);
  }, [user, toast, fetchCategories, fetchTransactions, transactionsTable, categoriesTable]);

  useEffect(() => {
    if (user && walletId) {
      setupData();
    }
  }, [user, walletId, setupData]);

  useEffect(() => {
    setLoading(transactionsLoading || categoriesLoading);
  }, [transactionsLoading, categoriesLoading]);

  const addTransaction = async (transaction) => {
    const category = categories.find(c => c.name === transaction.category && c.type === transaction.type);
    if (!category) {
        toast({ title: "Error", description: `Kategori "${transaction.category}" tidak ditemukan untuk tipe "${transaction.type}"`, variant: "destructive" });
        return;
    }
    await addTransactionHook(transaction, category.id);
    await fetchTransactions();
  };

  const updateTransaction = async (id, updatedTransaction) => {
    const category = categories.find(c => c.name === updatedTransaction.category && c.type === updatedTransaction.type);
    if (!category) {
        toast({ title: "Error", description: `Kategori "${updatedTransaction.category}" tidak ditemukan untuk tipe "${updatedTransaction.type}"`, variant: "destructive" });
        return;
    }
    await updateTransactionHook(id, updatedTransaction, category.id);
    await fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await deleteTransactionHook(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = async (category) => {
    await addCategoryHook(category);
    await fetchCategories();
  };

  const updateCategory = async (id, updatedCategory) => {
    await updateCategoryHook(id, updatedCategory);
    await Promise.all([fetchCategories(), fetchTransactions()]);
  };

  const deleteCategory = async (id) => {
    await deleteCategoryHook(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    await fetchTransactions();
  };

  const value = {
    transactions,
    categories,
    loading,
    formatCurrency,
    formatDate,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    getFilteredData,
    setupData,
    walletId,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, TrendingDown, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import ShimmerCard from '@/components/ShimmerCard';
import Pagination from '@/components/Pagination';

const Expense = () => {
  const { transactions, categories, loading, formatCurrency } = useData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('all');

  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);
  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);

  const filteredTransactions = useMemo(() => {
    return expenseTransactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthMatch = selectedMonth === 'all' || transactionDate.getMonth() === selectedMonth;
        const yearMatch = transactionDate.getFullYear() === selectedYear;
        return monthMatch && yearMatch;
      })
      .filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [expenseTransactions, searchTerm, selectedMonth, selectedYear]);
  
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalExpense = useMemo(() => expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0), [expenseTransactions]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const years = useMemo(() => {
    const uniqueYears = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];
    return uniqueYears.length > 0 ? uniqueYears.sort((a, b) => b - a) : [currentYear];
  }, [transactions, currentYear]);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <>
      <Helmet>
        <title>Pengeluaran - Financial Manager</title>
        <meta name="description" content="Kelola pengeluaran Anda dengan mudah." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">Pengeluaran</h1>
            <p className="text-gray-500">Kelola semua transaksi pengeluaran Anda</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white"
            onClick={resetForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengeluaran
          </Button>
        </div>

        <TransactionForm
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          type="expense"
          categories={expenseCategories}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 mb-1">Total Pengeluaran</p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                  <p className="text-sm text-red-700 mt-1">{expenseTransactions.length} transaksi</p>
                </div>
                <div className="p-4 rounded-xl bg-white text-red-600">
                  <TrendingDown className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Daftar Pengeluaran</CardTitle>
                  <CardDescription>Semua transaksi pengeluaran Anda</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-48"
                    />
                  </div>
                  <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(v === 'all' ? 'all' : Number(v))}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Bulan</SelectItem>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
                    <SelectTrigger className="w-full sm:w-[100px]">
                      <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
             {loading ? (
                 <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <ShimmerCard key={i} className="h-20" />)}
                 </div>
              ) : (
                <TransactionTable 
                  transactions={paginatedTransactions} 
                  loading={loading} 
                  onEdit={handleEdit} 
                  type="expense"
                />
              )}
            </CardContent>
             {filteredTransactions.length > 0 && (
                <CardFooter>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredTransactions.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Expense;
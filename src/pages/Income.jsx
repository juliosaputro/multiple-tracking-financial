import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, TrendingUp, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import ShimmerCard from '@/components/ShimmerCard';
import Pagination from '@/components/Pagination';

const Income = () => {
  const { transactions, categories, loading, formatCurrency } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('all');

  const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
  const incomeCategories = useMemo(() => categories.filter(c => c.type === 'income'), [categories]);

  const filteredTransactions = useMemo(() => {
    return incomeTransactions
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
  }, [incomeTransactions, searchTerm, selectedMonth, selectedYear]);
  
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalIncome = useMemo(() => incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0), [incomeTransactions]);

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
        <title>Pemasukan - Financial Manager</title>
        <meta name="description" content="Kelola pemasukan Anda dengan mudah." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">Pemasukan</h1>
            <p className="text-gray-500">Kelola semua transaksi pemasukan Anda</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            onClick={resetForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pemasukan
          </Button>
        </div>

        <TransactionForm
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          type="income"
          categories={incomeCategories}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 mb-1">Total Pemasukan</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                  <p className="text-sm text-green-700 mt-1">{incomeTransactions.length} transaksi</p>
                </div>
                <div className="p-4 rounded-xl bg-white text-green-600">
                  <TrendingUp className="h-8 w-8" />
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
                  <CardTitle>Daftar Pemasukan</CardTitle>
                  <CardDescription>Semua transaksi pemasukan Anda</CardDescription>
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
                  type="income"
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

export default Income;
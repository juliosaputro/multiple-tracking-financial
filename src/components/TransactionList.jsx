import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.jsx';

const TransactionList = ({ transactions, loading, onEdit, type }) => {
  const { formatCurrency, formatDate, deleteTransaction } = useData();
  const { toast } = useToast();

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    toast({ title: "Berhasil!", description: "Transaksi berhasil dihapus" });
  };

  const icon = type === 'income' 
    ? <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    : <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />;
  
  const colorClass = type === 'income' ? 'text-green-600' : 'text-red-600';
  const sign = type === 'income' ? '+' : '-';

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {icon}
        <p>Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${transaction.categoryColor}1A` }}>
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: transaction.categoryColor }}/>
            </div>
            <div>
              <p className="font-medium text-gray-800">{transaction.description}</p>
              <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <p className={`font-semibold ${colorClass}`}>
              {sign}{formatCurrency(transaction.amount)}
            </p>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100" onClick={() => onEdit(transaction)}>
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus transaksi secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(transaction.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;
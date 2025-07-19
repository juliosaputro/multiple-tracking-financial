import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TransactionTable = ({ transactions, loading, onEdit, type }) => {
  const { formatCurrency, formatDate, deleteTransaction } = useData();
  const { toast } = useToast();

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    toast({ title: "Berhasil!", description: "Transaksi berhasil dihapus" });
  };

  const colorClass = type === 'income' ? 'text-green-600' : 'text-red-600';
  const sign = type === 'income' ? '+' : '-';

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer h-12 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada transaksi yang cocok dengan filter Anda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipe</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <motion.tr
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {transaction.type}
                </span>
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: transaction.categoryColor }} />
                  <span>{transaction.categoryName}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell className={`text-right font-semibold ${colorClass}`}>
                {sign}{formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-1">
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
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
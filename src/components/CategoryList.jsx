
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Palette, FolderOpen } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

const CategoryList = ({ categories, loading, onEdit }) => {
  const { deleteCategory } = useData();
  const { toast } = useToast();

  const handleDelete = async (id) => {
    await deleteCategory(id);
    toast({ title: "Berhasil!", description: "Kategori berhasil dihapus" });
  };

  const getTypeLabel = (type) => (type === 'income' ? 'Pemasukan' : 'Pengeluaran');
  const getTypeColor = (type) => (type === 'income' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100');

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FolderOpen className="h-12 w-12 mx-auto mb-4" />
        <p>Belum ada kategori</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
            <div>
              <p className="text-gray-800 font-medium">{category.name}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTypeColor(category.type)}`}>
                {getTypeLabel(category.type)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <Palette className="h-4 w-4" />
              <span className="text-sm">{category.color}</span>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100" onClick={() => onEdit(category)}>
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
                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus kategori secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
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

export default CategoryList;

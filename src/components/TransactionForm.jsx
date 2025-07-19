import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const TransactionForm = ({ isOpen, setIsOpen, editingTransaction, setEditingTransaction, type, categories }) => {
  const { addTransaction, updateTransaction, loading } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.categoryName,
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({ 
        description: '', 
        amount: '', 
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      toast({ title: "Error", description: "Semua field harus diisi", variant: "destructive" });
      return;
    }
    
    if (parseInt(formData.amount) <= 0) {
      toast({ title: "Error", description: "Jumlah harus lebih dari 0", variant: "destructive" });
      return;
    }

    const transactionData = {
      description: formData.description,
      amount: formData.amount,
      category: formData.category,
      type: type,
      date: new Date(formData.date).toISOString(),
    };

    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
      toast({ title: "Berhasil!", description: "Transaksi berhasil diperbarui" });
    } else {
      await addTransaction(transactionData);
      toast({ title: "Berhasil!", description: "Transaksi berhasil ditambahkan" });
    }

    setIsOpen(false);
    setEditingTransaction(null);
  };

  const title = type === 'income' ? 'Pemasukan' : 'Pengeluaran';
  const buttonClass = type === 'income' 
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-red-600 hover:bg-red-700 text-white";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTransaction ? `Edit ${title}` : `Tambah ${title}`}</DialogTitle>
          <DialogDescription>
            {editingTransaction ? `Perbarui data ${title.toLowerCase()}` : `Tambahkan ${title.toLowerCase()} baru`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder={`Contoh: ${type === 'income' ? 'Gaji bulanan' : 'Makan siang'}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                )) : <div className="p-4 text-center text-sm text-gray-500">Tidak ada kategori.</div>}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className={buttonClass}>
              {loading ? <LoadingSpinner size="sm" /> : (editingTransaction ? 'Perbarui' : 'Tambah')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
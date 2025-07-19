
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const CategoryForm = ({ isOpen, setIsOpen, editingCategory, setEditingCategory }) => {
  const { categories, addCategory, updateCategory, loading } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    type: 'expense'
  });

  const colorOptions = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16',
    '#10b981', '#14b8a6', '#6366f1', '#a855f7', '#d946ef'
  ];

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        color: editingCategory.color,
        type: editingCategory.type
      });
    } else {
      setFormData({ name: '', color: '#3b82f6', type: 'expense' });
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.color || !formData.type) {
      toast({ title: "Error", description: "Semua field harus diisi", variant: "destructive" });
      return;
    }
    const isDuplicate = categories.some(cat => cat.name.toLowerCase() === formData.name.toLowerCase() && cat.id !== editingCategory?.id);
    if (isDuplicate) {
      toast({ title: "Error", description: "Nama kategori sudah ada", variant: "destructive" });
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
      toast({ title: "Berhasil!", description: "Kategori berhasil diperbarui" });
    } else {
      await addCategory(formData);
      toast({ title: "Berhasil!", description: "Kategori berhasil ditambahkan" });
    }

    setIsOpen(false);
    setEditingCategory(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Perbarui data kategori' : 'Tambahkan kategori baru'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input id="name" placeholder="Contoh: Makanan" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Pengeluaran</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Warna</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: formData.color }} />
                <Input id="color" type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-16 h-8 p-1" />
                <span className="text-sm text-gray-500">{formData.color}</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {colorOptions.map((color) => (
                  <button key={color} type="button" className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color ? 'border-blue-500 scale-110' : 'border-gray-200 hover:border-gray-400'}`} style={{ backgroundColor: color }} onClick={() => setFormData({ ...formData, color })} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
              {loading ? <LoadingSpinner size="sm" /> : (editingCategory ? 'Perbarui' : 'Tambah')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, FolderOpen, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';
import Pagination from '@/components/Pagination';
import ShimmerCard from '@/components/ShimmerCard';

const Categories = () => {
  const { categories, loading } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Kategori - Financial Manager</title>
        <meta name="description" content="Kelola kategori transaksi Anda." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">Kategori</h1>
            <p className="text-gray-500">Kelola kategori transaksi Anda</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white"
            onClick={resetForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        <CategoryForm
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Kategori</p>
                    <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Kategori Pemasukan</p>
                    <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.type === 'income').length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white text-green-600">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 mb-1">Kategori Pengeluaran</p>
                    <p className="text-2xl font-bold text-red-600">{categories.filter(c => c.type === 'expense').length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white text-red-600">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Daftar Kategori</CardTitle>
                  <CardDescription>Semua kategori transaksi Anda</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => <ShimmerCard key={i} className="h-20" />)}
                </div>
              ) : (
                <CategoryList 
                  categories={paginatedCategories} 
                  loading={loading} 
                  onEdit={handleEdit} 
                />
              )}
            </CardContent>
            {filteredCategories.length > itemsPerPage && (
                <CardFooter>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredCategories.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Categories;

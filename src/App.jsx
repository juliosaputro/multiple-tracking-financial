import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { DataProvider } from '@/contexts/DataContext.jsx';
import Login from '@/pages/Login.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import Income from '@/pages/Income.jsx';
import Expense from '@/pages/Expense.jsx';
import Categories from '@/pages/Categories.jsx';
import Layout from '@/components/Layout.jsx';
import LoadingSpinner from '@/components/LoadingSpinner';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  return session ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  return !session ? children : <Navigate to="/dompetku/dashboard" />;
}

const WalletLayout = () => {
    const { walletId } = useParams();
    const validWallets = ['dompetku', 'kulinerku', 'es-mambo'];

    if (!validWallets.includes(walletId)) {
        return <Navigate to="/dompetku/dashboard" />;
    }

    return (
        <DataProvider key={walletId} walletId={walletId}>
            <Layout>
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="income" element={<Income />} />
                    <Route path="expense" element={<Expense />} />
                    <Route path="categories" element={<Categories />} />
                </Routes>
            </Layout>
        </DataProvider>
    );
};

function App() {
  return (
    <>
      <Helmet>
        <title>Financial Manager - Kelola Keuangan Anda</title>
        <meta name="description" content="Aplikasi manajemen keuangan modern untuk mengelola pemasukan, pengeluaran, dan kategori transaksi dengan visualisasi yang menarik." />
      </Helmet>
      
      <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route
                    path="/:walletId/*"
                    element={
                        <ProtectedRoute>
                            <WalletLayout />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dompetku/dashboard" />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
      </AuthProvider>
    </>
  );
}

export default App;
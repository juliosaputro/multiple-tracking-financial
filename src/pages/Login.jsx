import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const { signIn, signUp, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        toast({
          title: "Login Berhasil!",
          description: "Selamat datang kembali.",
        });
      }
    } else {
      const { error } = await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.name,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=fff`
        }
      });
      if (!error) {
        toast({
          title: "Pendaftaran Berhasil!",
          description: "Akun Anda telah dibuat. Anda bisa login sekarang.",
        });
        setIsLogin(true); // Arahkan ke form login setelah berhasil daftar
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Masuk' : 'Daftar'} - Financial Manager</title>
        <meta name="description" content={`${isLogin ? 'Masuk ke' : 'Daftar'} akun Financial Manager untuk mengelola keuangan Anda`} />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-white font-bold text-2xl">FM</span>
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text">Financial Manager</h1>
              <p className="text-gray-400 mt-2">Kelola keuangan Anda dengan mudah</p>
            </div>

            <Card className="glass-card border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">
                  {isLogin ? 'Masuk' : 'Daftar Akun'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isLogin 
                    ? 'Masuk ke akun Anda untuk melanjutkan' 
                    : 'Buat akun baru untuk memulai'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-black">Nama Lengkap</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 bg-white/5 border-white/10 text-black placeholder:text-gray-400"
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Masukkan email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/5 border-white/10 text-black placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-white/5 border-white/10 text-black placeholder:text-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      isLogin ? 'Masuk' : 'Daftar'
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
                    >
                      {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
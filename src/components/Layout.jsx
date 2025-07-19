import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  FolderOpen, 
  Menu, 
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Utensils,
  IceCream2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const wallets = [
    { id: 'dompetku', label: 'Dompetku', icon: Wallet },
    { id: 'kulinerku', label: 'Kulinerku', icon: Utensils },
    { id: 'es-mambo', label: 'Es Mambo', icon: IceCream2 },
];

const subMenuItems = [
    { path: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: 'income', icon: TrendingUp, label: 'Pemasukan' },
    { path: 'expense', icon: TrendingDown, label: 'Pengeluaran' },
    { path: 'categories', icon: FolderOpen, label: 'Kategori' }
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { walletId } = useParams();
  const [openWallets, setOpenWallets] = useState({[walletId]: true});

  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleWallet = (id) => {
    setOpenWallets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const userName = user?.user_metadata?.full_name || user?.email;
  const userAvatar = user?.user_metadata?.avatar_url;
  const userInitial = userName?.charAt(0).toUpperCase() || 'U';

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4">
      <div className={`flex items-center justify-between mb-8 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FM</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">Multi Wallet</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1">
        {wallets.map(wallet => {
          const isOpen = openWallets[wallet.id];
          return (
            <div key={wallet.id}>
              <div
                className={cn(
                    'flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer',
                    wallet.id === walletId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                )}
                onClick={() => !isCollapsed && toggleWallet(wallet.id)}
              >
                  <Link to={`/${wallet.id}/dashboard`} className='flex items-center space-x-3 w-full'>
                      <wallet.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="font-semibold">{wallet.label}</span>}
                  </Link>
                {!isCollapsed && (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
              </div>
              
              <AnimatePresence>
                {isOpen && !isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-6"
                    >
                        <div className="pt-2 pb-1 space-y-1 border-l-2 border-gray-200 ml-3">
                            {subMenuItems.map(item => {
                                const fullPath = `/${wallet.id}/${item.path}`;
                                const isActive = location.pathname === fullPath;
                                return (
                                    <Link key={item.path} to={fullPath}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ml-2',
                                                isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>
      
      <div className={`border-t border-gray-200 pt-4 ${isCollapsed ? 'space-y-4' : ''}`}>
        <div className={`flex items-center space-x-3 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={`w-full text-gray-500 hover:text-red-600 hover:bg-red-50 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={signOut}
        >
          <LogOut className={`h-4 w-4 ${!isCollapsed && 'mr-2'}`} />
          {!isCollapsed && 'Keluar'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <motion.aside
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed lg:hidden inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-500">Selamat datang kembali,</p>
                <p className="font-semibold text-gray-800">{userName}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
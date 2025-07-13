import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Play, 
  Star, 
  Shield, 
  TrendingUp, 
  Globe, 
  Users, 
  Award,
  BarChart3,
  Smartphone,
  Monitor,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
  User,
  LogOut,
  DollarSign,
  PieChart,
  Activity,
  CreditCard,
  Plus,
  Minus
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API}/auth/register`, userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Validation schemas
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone: yup.string(),
  country: yup.string(),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required')
});

// Header Component with Auth
export const Header = ({ showAuthButtons = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: 'Trading',
      submenu: ['Pro Conditions', 'Open Trading Account', 'Pricing Model', 'Funding & Withdrawals', 'PAMM Accounts']
    },
    {
      label: 'Trading Platforms',
      submenu: ['Platform Comparison', 'AdaFx Mobile App', 'MetaTrader 5', 'MetaTrader 4', 'cTrader', 'WebTrader']
    },
    {
      label: 'Markets & Tools',
      submenu: ['Forex', 'Shares', 'Crypto', 'Indices', 'Futures', 'Metals', 'ETFs', 'Technical Analysis']
    },
    {
      label: 'Education',
      submenu: ['Trading Basics', 'Fundamental Analysis', 'Technical Analysis', 'Webinars', 'Articles']
    },
    {
      label: 'Company',
      submenu: ['About AdaFx', 'Awards', 'Contact Us', 'Licenses & Regulation', 'Careers']
    }
  ];

  return (
    <>
      <motion.header 
        className="bg-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top bar */}
        <div className="bg-blue-900 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 24/5 Customer Support</span>
              <span>🛡️ Regulated & Secure</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Client Portal</span>
              <span>Partner Area</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="text-3xl font-bold text-blue-900 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => window.location.href = '/'}
            >
              AdaCapitalMarket
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <div 
                  key={index}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium">
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === index && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <a
                            key={subIndex}
                            href="#"
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {subItem}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            {showAuthButtons && (
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{user.first_name}</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={logout}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Log In
                    </button>
                    <motion.button 
                      onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Open Account
                    </motion.button>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="lg:hidden mt-4 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {menuItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 py-2">
                    <button className="flex items-center justify-between w-full text-left text-gray-700 font-medium">
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {showAuthButtons && (
                  <div className="flex flex-col space-y-2 mt-4">
                    {user ? (
                      <>
                        <button 
                          onClick={() => window.location.href = '/dashboard'}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={logout}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg"
                        >
                          Log In
                        </button>
                        <button 
                          onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                          Open Account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  );
};

// Auth Modal Component
export const AuthModal = ({ isOpen, onClose, mode, setMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, register } = useAuth();

  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(mode === 'login' ? loginSchema : registerSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const result = await login(data.email, data.password);
        if (result.success) {
          onClose();
          window.location.href = '/dashboard';
        } else {
          setMessage(result.error);
        }
      } else {
        const result = await register(data);
        if (result.success) {
          setMessage('Registration successful! Please login.');
          setMode('login');
          reset();
        } else {
          setMessage(result.error);
        }
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-md w-full p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    {...registerField('first_name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    {...registerField('last_name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  {...registerField('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country (Optional)</label>
                <input
                  {...registerField('country')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...registerField('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                {...registerField('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                {...registerField('confirm_password')}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setMessage('');
              reset();
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// User Dashboard Components
export const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'accounts', label: 'Trading Accounts', icon: <Monitor className="w-5 h-5" /> },
    { id: 'trades', label: 'Trades', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white shadow-lg h-full min-h-screen w-64 fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-900">AdaCapitalMarket</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome, {user?.first_name}</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
              activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData?.total_balance?.toLocaleString() || '0'}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equity</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData?.total_equity?.toLocaleString() || '0'}
              </p>
            </div>
            <PieChart className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={`text-2xl font-bold ${
                (dashboardData?.total_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${dashboardData?.total_profit?.toLocaleString() || '0'}
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Trades</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.open_trades || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Trading Accounts */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trading Accounts</h2>
        <div className="space-y-4">
          {dashboardData?.accounts?.map((account) => (
            <div key={account.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
                  </h3>
                  <p className="text-sm text-gray-600">#{account.account_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${account.balance.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Balance</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Trades</h2>
          <div className="space-y-3">
            {dashboardData?.recent_trades?.length > 0 ? (
              dashboardData.recent_trades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{trade.symbol}</p>
                    <p className="text-sm text-gray-600">{trade.trade_type.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{trade.volume}</p>
                    <p className={`text-sm ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${trade.profit.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent trades</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {dashboardData?.recent_transactions?.length > 0 ? (
              dashboardData.recent_transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${transaction.amount}</p>
                    <p className={`text-sm ${
                      transaction.status === 'completed' ? 'text-green-600' : 
                      transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep all the original marketing components
export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1643962578875-90e5e275d449?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxmb3JleCUyMHRyYWRpbmd8ZW58MHx8fGJsdWV8MTc1MjM3MDU5N3ww&ixlib=rb-4.1.0&q=85')`
        }}
      />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Trade with <span className="text-green-400">Confidence</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Experience superior trading conditions with AdaCapitalMarket. 
              Access global markets with tight spreads, fast execution, and professional tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-4 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Trading Now
              </motion.button>
              <motion.button 
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Demo Account
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  <CountUp end={500000} duration={2} separator="," />+
                </div>
                <div className="text-sm text-blue-200">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  $<CountUp end={2.5} decimals={1} duration={2} />B
                </div>
                <div className="text-sm text-blue-200">Monthly Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  <CountUp end={15} duration={2} />
                </div>
                <div className="text-sm text-blue-200">Years Experience</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="bg-white rounded-lg p-4 text-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">EUR/USD</h3>
                  <span className="text-green-500 font-bold">+0.0025</span>
                </div>
                <div className="text-3xl font-bold mb-4">1.0925</div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button className="bg-green-500 text-white py-2 rounded font-medium">BUY</button>
                  <button className="bg-red-500 text-white py-2 rounded font-medium">SELL</button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Spread:</span>
                    <span>0.7 pips</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leverage:</span>
                    <span>1:500</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Regulated & Secure",
      description: "Licensed and regulated by top-tier financial authorities. Your funds are protected."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Trading Tools",
      description: "Professional charts, technical indicators, and market analysis tools."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Markets",
      description: "Trade Forex, CFDs, Shares, Commodities, and Cryptocurrencies."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "24/5 Support",
      description: "Dedicated customer support available 24 hours, 5 days a week."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose AdaCapitalMarket?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our industry-leading trading conditions and professional support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TradingPlatformsSection = () => {
  const platforms = [
    {
      name: "MetaTrader 5",
      description: "Advanced multi-asset platform with superior features",
      features: ["Advanced Charts", "Expert Advisors", "Market Depth", "Economic Calendar"],
      image: "https://images.pexels.com/photos/9169180/pexels-photo-9169180.jpeg"
    },
    {
      name: "MetaTrader 4",
      description: "World's most popular forex trading platform",
      features: ["One-Click Trading", "Custom Indicators", "Automated Trading", "Mobile Trading"],
      image: "https://images.pexels.com/photos/7789849/pexels-photo-7789849.jpeg"
    },
    {
      name: "cTrader",
      description: "Professional platform for advanced traders",
      features: ["Level II Pricing", "cBots", "Copy Trading", "Advanced Charting"],
      image: "https://images.pexels.com/photos/7663144/pexels-photo-7663144.jpeg"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Professional Trading Platforms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from industry-leading platforms designed for traders of all levels.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-48">
                <img 
                  src={platform.image} 
                  alt={platform.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/20"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{platform.name}</h3>
                <p className="text-gray-600 mb-6">{platform.description}</p>
                <ul className="space-y-2 mb-8">
                  {platform.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button 
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AccountTypesSection = () => {
  const accountTypes = [
    {
      name: "Standard Account",
      subtitle: "Perfect for beginners",
      spread: "From 1.2 pips",
      commission: "No commission",
      minDeposit: "$100",
      features: ["Micro lot trading", "Floating spreads", "All platforms", "Free educational resources"],
      popular: false
    },
    {
      name: "Raw+ Account",
      subtitle: "Professional trading",
      spread: "From 0.0 pips",
      commission: "Up to $3.5/lot",
      minDeposit: "$500",
      features: ["Raw spreads", "Fast execution", "Professional tools", "Advanced analytics"],
      popular: true
    },
    {
      name: "Elite Account",
      subtitle: "Premium experience",
      spread: "From 0.0 pips",
      commission: "Rebates up to 21%",
      minDeposit: "$30,000",
      features: ["VIP support", "Exclusive tools", "Premium rates", "Personal manager"],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Account Type
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the account that best fits your trading style and experience level.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {accountTypes.map((account, index) => (
            <motion.div
              key={index}
              className={`relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all ${
                account.popular ? 'border-2 border-green-500 transform scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {account.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{account.name}</h3>
                <p className="text-gray-600 mb-6">{account.subtitle}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="text-3xl font-bold text-blue-600">{account.spread}</div>
                  <div className="text-gray-600">Spread</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900">Commission</div>
                    <div className="text-gray-600">{account.commission}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Min Deposit</div>
                    <div className="text-gray-600">{account.minDeposit}</div>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {account.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <motion.button 
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                  account.popular 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open {account.name}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const MarketInstrumentsSection = () => {
  const instruments = [
    { name: "Forex", pairs: "70+ pairs", spread: "From 0.7 pips", leverage: "1:500" },
    { name: "Shares", pairs: "1000+ stocks", spread: "From $0.02", leverage: "1:20" },
    { name: "Indices", pairs: "20+ indices", spread: "From 0.5 pts", leverage: "1:100" },
    { name: "Crypto", pairs: "15+ pairs", spread: "From 0.5%", leverage: "1:10" },
    { name: "Metals", pairs: "Gold, Silver", spread: "From 2.0 pips", leverage: "1:500" },
    { name: "Energy", pairs: "Oil, Gas", spread: "From 3.0 pts", leverage: "1:100" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trade Global Markets
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access diverse financial markets with competitive spreads and flexible leverage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{instrument.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instruments:</span>
                  <span className="font-semibold">{instrument.pairs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spread from:</span>
                  <span className="font-semibold text-green-600">{instrument.spread}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leverage:</span>
                  <span className="font-semibold">{instrument.leverage}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">AdaCapitalMarket</h3>
            <p className="text-gray-400 mb-6">
              Leading forex and CFD broker providing access to global financial markets with professional trading conditions.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-900">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Trading</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Open Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Account Types</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trading Platforms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trading Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Demo Account</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Markets</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Forex</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shares</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Indices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Commodities</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cryptocurrencies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                support@adacapitalmarket.com
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                New York, USA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AdaCapitalMarket. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Risk Warning</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
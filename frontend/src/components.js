import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
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
  MapPin
} from 'lucide-react';

// Header Component
export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
            className="text-3xl font-bold text-blue-900"
            whileHover={{ scale: 1.05 }}
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
          <div className="hidden lg:flex items-center space-x-4">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Log In
            </button>
            <motion.button 
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Account
            </motion.button>
          </div>

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
              <div className="flex flex-col space-y-2 mt-4">
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg">
                  Log In
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                  Open Account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

// Hero Section Component
export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1643962578875-90e5e275d449?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxmb3JleCUyMHRyYWRpbmd8ZW58MHx8fGJsdWV8MTc1MjM3MDU5N3ww&ixlib=rb-4.1.0&q=85')`
        }}
      />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
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

            {/* Stats */}
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

          {/* Trading Interface Mockup */}
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

// Features Section Component
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

// Trading Platforms Section Component
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

// Account Types Section Component
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

// Market Instruments Section Component
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

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
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

          {/* Trading */}
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

          {/* Markets */}
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

          {/* Support */}
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

        {/* Bottom Bar */}
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
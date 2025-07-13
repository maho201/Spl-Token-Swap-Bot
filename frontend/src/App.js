import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { 
  AuthProvider,
  useAuth,
  Header, 
  HeroSection, 
  FeaturesSection, 
  TradingPlatformsSection, 
  AccountTypesSection, 
  MarketInstrumentsSection, 
  Footer,
  DashboardSidebar,
  DashboardOverview
} from './components';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" />;
};

// Home Page Component
const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TradingPlatformsSection />
      <AccountTypesSection />
      <MarketInstrumentsSection />
      <Footer />
    </div>
  );
};

// Dashboard Page Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'accounts':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Trading Accounts</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600">Trading accounts management coming soon...</p>
            </div>
          </div>
        );
      case 'trades':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Active Trades</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600">Trading interface coming soon...</p>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Transactions</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600">Transaction history coming soon...</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600">Profile management coming soon...</p>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthButtons={false} />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 ml-64">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
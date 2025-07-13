import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  Header, 
  HeroSection, 
  FeaturesSection, 
  TradingPlatformsSection, 
  AccountTypesSection, 
  MarketInstrumentsSection, 
  Footer 
} from './components';

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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
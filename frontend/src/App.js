import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CompareProvider } from './contexts/CompareContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgressBar from './components/ProgressBar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Compare from './pages/Compare';
import Admin from './pages/Admin';
import IphoneAdmin from './pages/IphoneAdmin';
import MacbookAdmin from './pages/MacbookAdmin';
import AppleWatchAdmin from './pages/AppleWatchAdmin';
import AirpodsAdmin from './pages/AirpodsAdmin';
import IpadAdmin from './pages/IpadAdmin';
import AccesoriosAdmin from './pages/AccesoriosAdmin';
import ExchangeRateAdmin from './pages/ExchangeRateAdmin';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <CompareProvider>
        <BrowserRouter>
          <div className="App" data-testid="app">
            <ProgressBar />
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/iphones" element={<IphoneAdmin />} />
                <Route path="/admin/macbooks" element={<MacbookAdmin />} />
                <Route path="/admin/apple-watch" element={<AppleWatchAdmin />} />
                <Route path="/admin/airpods" element={<AirpodsAdmin />} />
                <Route path="/admin/ipads" element={<IpadAdmin />} />
                <Route path="/admin/accesorios" element={<AccesoriosAdmin />} />
                <Route path="/admin/exchange-rates" element={<ExchangeRateAdmin />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CompareProvider>
    </ThemeProvider>
  );
}

export default App;

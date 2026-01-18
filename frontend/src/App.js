import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CompareProvider } from './contexts/CompareContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
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
import SnowEffect from './components/SnowEffect';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompareProvider>
          <BrowserRouter>
            <div className="App" data-testid="app">
              <SnowEffect />
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/compare" element={<Compare />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/admin/iphones" element={<ProtectedRoute><IphoneAdmin /></ProtectedRoute>} />
                  <Route path="/admin/macbooks" element={<ProtectedRoute><MacbookAdmin /></ProtectedRoute>} />
                  <Route path="/admin/apple-watch" element={<ProtectedRoute><AppleWatchAdmin /></ProtectedRoute>} />
                  <Route path="/admin/airpods" element={<ProtectedRoute><AirpodsAdmin /></ProtectedRoute>} />
                  <Route path="/admin/ipads" element={<ProtectedRoute><IpadAdmin /></ProtectedRoute>} />
                  <Route path="/admin/accesorios" element={<ProtectedRoute><AccesoriosAdmin /></ProtectedRoute>} />
                  <Route path="/admin/exchange-rates" element={<ProtectedRoute><ExchangeRateAdmin /></ProtectedRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CompareProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

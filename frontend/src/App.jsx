import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ThemesPage from './pages/ThemesPage';
import ThemeDetailPage from './pages/ThemeDetailPage';
import RequestLecturePage from './pages/RequestLecturePage';
import ConfirmationPage from './pages/ConfirmationPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDetailPage from './pages/AdminDetailPage';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/temas" element={<ThemesPage />} />
          <Route path="/temas/:slug" element={<ThemeDetailPage />} />
          <Route path="/solicitar" element={<RequestLecturePage />} />
          <Route path="/confirmacao/:protocolo" element={<ConfirmationPage />} />
          <Route path="/conteudos" element={<ArticlesPage />} />
          <Route path="/conteudos/:slug" element={<ArticleDetailPage />} />

          {/* Rotas Administrativas */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/solicitacoes/:id" element={<AdminDetailPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

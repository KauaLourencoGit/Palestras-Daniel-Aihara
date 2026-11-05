import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Lock, Menu, X, Sparkles, BookOpen, User, Layers } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo e Nome */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              DA
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5">
                Daniel Takeo Aihara
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              </span>
              <span className="text-xs text-brand-400 font-semibold tracking-wide uppercase">
                Educação Financeira & Palestras
              </span>
            </div>
          </Link>

          {/* Links Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/') ? 'text-brand-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Início
            </Link>
            <Link
              to="/temas"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/temas') ? 'text-brand-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-brand-400" />
              Catálogo de Palestras
            </Link>
            <Link
              to="/conteudos"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/conteudos') ? 'text-brand-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-brand-400" />
              Artigos & Dicas
            </Link>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:border-brand-500 hover:text-brand-300 transition-colors"
              title="Swagger OpenAPI Spec"
            >
              API Docs
            </a>
          </nav>

          {/* Botões CTA e Painel */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/solicitar"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-teal-300 hover:from-brand-300 hover:to-teal-200 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transform hover:-translate-y-0.5 transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              Solicitar Palestra
            </Link>
            <Link
              to="/admin"
              className="p-2.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              title="Painel Administrativo do Daniel"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Botão Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/solicitar"
              className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-brand-400 rounded-lg"
            >
              Solicitar
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {mobileOpen && (
        <div className="md:hidden glass border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-brand-400"
          >
            Início
          </Link>
          <Link
            to="/temas"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-brand-400"
          >
            Catálogo de Palestras
          </Link>
          <Link
            to="/conteudos"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-brand-400"
          >
            Artigos Educativos
          </Link>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" /> Acesso Painel Daniel
            </Link>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-400"
            >
              Swagger Docs &rarr;
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

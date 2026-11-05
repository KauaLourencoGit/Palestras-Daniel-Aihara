import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Coluna 1: Sobre */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                DA
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">Daniel Takeo Aihara</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Especialista em educação financeira, apoiando empresas, escolas e instituições em todo o Brasil a transformarem o estresse financeiro em tranquilidade, foco e produtividade.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Conformidade estrita com a LGPD (Lei Geral de Proteção de Dados)</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/temas" className="hover:text-brand-400 transition-colors">Catálogo de Palestras</Link>
              </li>
              <li>
                <Link to="/conteudos" className="hover:text-brand-400 transition-colors">Artigos & Conteúdos</Link>
              </li>
              <li>
                <Link to="/solicitar" className="hover:text-brand-400 transition-colors">Solicitar Orçamento</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Projeto Acadêmico */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Projeto UNITRI 2026-2</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipe de Produto Grupo 4: Arthur, Dyego, Guilherme Ide, Guilherme Freitas, Maria Fernanda e Platão Leonel.
            </p>
            <p className="text-xs text-slate-500">
              Orientação: Prof. Milton Miranda Neto
            </p>
            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <span>Acesso Painel Administrativo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Daniel Takeo Aihara. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Construído para a Sprint 1 &bull; Deploy preparado para Vercel + Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowLeft, Sparkles, Key } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('daniel.aihara@exemplo.com');
  const [senha, setSenha] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      await api.login(email, senha);
      navigate('/admin');
    } catch (err) {
      setErro(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/20">
            DA
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Painel de Gestão</h1>
          <p className="text-xs text-slate-400">
            Acesso restrito ao palestrante Daniel Takeo Aihara
          </p>
        </div>

        {erro && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Falha no Acesso:</strong>
              <span>{erro}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Dica para apresentação e avaliação */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-brand-500/30 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-brand-400 font-bold">
              <Key className="w-3.5 h-3.5" />
              <span>Credenciais padrão para avaliação:</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              E-mail: <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">daniel.aihara@exemplo.com</code><br />
              Senha: <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">admin123456</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-brand-400 to-teal-300 hover:from-brand-300 hover:to-teal-200 rounded-xl shadow-lg shadow-brand-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Validando credenciais...' : 'Entrar no Painel'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site público
          </Link>
        </div>

      </div>
    </div>
  );
}

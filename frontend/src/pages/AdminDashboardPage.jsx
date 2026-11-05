import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, ArrowRight, Clock, Building2, User, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [totais, setTotais] = useState({});
  const [statusFiltro, setStatusFiltro] = useState('ABERTAS');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('criado_em_desc');
  const [loading, setLoading] = useState(true);

  const carregarDados = () => {
    setLoading(true);
    api.getRequests({ status: statusFiltro, busca, ordem })
      .then(res => {
        setSolicitacoes(res.solicitacoes || []);
        setTotais(res.totais || {});
      })
      .catch(err => {
        if (err.status === 401) {
          navigate('/admin/login');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarDados();
  }, [statusFiltro, ordem]);

  const handleSearch = (e) => {
    e.preventDefault();
    carregarDados();
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    navigate('/admin/login');
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'NOVA':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Nova</span>;
      case 'EM_ANALISE':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Em Análise</span>;
      case 'PROPOSTA_ENVIADA':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>Proposta Enviada</span>;
      case 'CONFIRMADA':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Confirmada</span>;
      case 'REALIZADA':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Realizada</span>;
      case 'RECUSADA':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>Recusada</span>;
      case 'CANCELADA':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>Cancelada</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-300">{st}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Painel do Daniel Takeo Aihara
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Gestão do Funil de Palestras
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={carregarDados}
            className="p-2.5 text-slate-400 hover:text-white glass-card rounded-xl transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white glass-card hover:bg-red-950/40 hover:border-red-500/40 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {/* Contadores do Funil */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { key: 'ABERTAS', label: 'Abertas (Ativas)', cor: 'text-brand-400' },
          { key: 'NOVA', label: 'Novas', cor: 'text-blue-400' },
          { key: 'EM_ANALISE', label: 'Em Análise', cor: 'text-amber-400' },
          { key: 'PROPOSTA_ENVIADA', label: 'Proposta', cor: 'text-indigo-400' },
          { key: 'CONFIRMADA', label: 'Confirmadas', cor: 'text-emerald-400' },
          { key: 'REALIZADA', label: 'Realizadas', cor: 'text-slate-400' },
          { key: 'RECUSADA', label: 'Encerradas', cor: 'text-red-400', count: (totais.RECUSADA || 0) + (totais.CANCELADA || 0) }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setStatusFiltro(item.key)}
            className={`p-4 rounded-2xl text-left glass-card transition-all ${
              statusFiltro === item.key ? 'border-brand-500 ring-2 ring-brand-500/20' : 'hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              {item.label}
            </span>
            <span className={`text-2xl font-black mt-1 block ${item.cor}`}>
              {item.count !== undefined ? item.count : (totais[item.key] || 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Barra de Busca e Filtro */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por protocolo, organização, contato ou e-mail..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none"
            >
              <option value="ABERTAS">Filtro: Todas Abertas (Ativas)</option>
              <option value="TODAS">Filtro: Todas as Solicitações</option>
              <option value="NOVA">Filtro: Apenas Novas</option>
              <option value="EM_ANALISE">Filtro: Em Análise</option>
              <option value="PROPOSTA_ENVIADA">Filtro: Proposta Enviada</option>
              <option value="CONFIRMADA">Filtro: Confirmadas</option>
              <option value="REALIZADA">Filtro: Realizadas</option>
              <option value="RECUSADA">Filtro: Recusadas</option>
              <option value="CANCELADA">Filtro: Canceladas</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Solicitações */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Solicitações ({solicitacoes.length} encontradas)
          </h2>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : solicitacoes.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Nenhuma solicitação encontrada</h3>
            <p className="text-xs text-slate-400">Tente alterar o status ou o termo de busca.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Protocolo</th>
                  <th className="py-3.5 px-4">Organização / Contato</th>
                  <th className="py-3.5 px-4">Data Desejada</th>
                  <th className="py-3.5 px-4">Local</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                {solicitacoes.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                    
                    <td className="py-4 px-6 font-mono font-bold text-brand-400 whitespace-nowrap">
                      {s.protocolo}
                      <span className="block text-[10px] text-slate-500 font-sans font-normal">
                        {new Date(s.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <strong className="text-white block font-bold">{s.organizacao}</strong>
                      <span className="text-slate-400 text-xs">{s.nome_contato} &bull; {s.email}</span>
                      {s.tema_titulo && (
                        <span className="block text-[11px] text-brand-300/80 truncate max-w-xs mt-0.5">
                          Tema: {s.tema_titulo}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <strong className="text-white block">
                        {new Date(s.data_desejada + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </strong>
                      <span className="text-[11px] text-slate-400">{s.formato}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-300">
                      {s.cidade}/{s.estado}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(s.status)}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/solicitacoes/${s.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-all"
                      >
                        <span>Gerenciar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Layers, Sparkles } from 'lucide-react';
import ThemeCard from '../components/ThemeCard';
import { api } from '../services/api';

export default function ThemesPage() {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [formatoFiltro, setFormatoFiltro] = useState('TODOS');

  useEffect(() => {
    api.getThemes()
      .then(data => setTemas(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const temasFiltrados = temas.filter(t => {
    const matchBusca = t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       t.descricao_curta.toLowerCase().includes(busca.toLowerCase()) ||
                       t.publico_alvo.toLowerCase().includes(busca.toLowerCase());
    
    if (formatoFiltro === 'TODOS') return matchBusca;
    return matchBusca && t.formatos.toUpperCase().includes(formatoFiltro);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Cabeçalho da Página */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-block">
          Ementas & Conteúdos
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Catálogo Completo de Palestras
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Temas estruturados para gerar impacto imediato. Selecione a palestra mais alinhada ao momento da sua empresa, convenção ou instituição.
        </p>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, público-alvo ou palavra-chave..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={formatoFiltro}
            onChange={(e) => setFormatoFiltro(e.target.value)}
            className="w-full py-3 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none"
          >
            <option value="TODOS">Todos os Formatos</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="ONLINE">Online (Transmissão)</option>
          </select>
        </div>
      </div>

      {/* Grid de Palestras */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 rounded-3xl glass-card animate-pulse"></div>
          ))}
        </div>
      ) : temasFiltrados.length === 0 ? (
        <div className="text-center py-16 space-y-3 glass-card rounded-3xl border border-slate-800 p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Nenhum tema encontrado</h3>
          <p className="text-sm text-slate-400">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {temasFiltrados.map(tema => (
            <ThemeCard key={tema.id} tema={tema} />
          ))}
        </div>
      )}

      {/* Card de Tema Sob Medida */}
      <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Tema Customizado
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Não encontrou o tema exato para o seu evento?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Daniel Takeo Aihara desenvolve roteiros e dinâmicas sob medida para objetivos específicos da sua empresa ou convenção.
          </p>
        </div>
        <Link
          to="/solicitar"
          className="whitespace-nowrap px-6 py-3.5 text-sm font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md"
        >
          Solicitar Tema Customizado
        </Link>
      </div>

    </div>
  );
}

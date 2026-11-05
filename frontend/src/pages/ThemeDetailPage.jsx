import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowLeft, Calendar, ShieldCheck, Users, Sparkles, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function ThemeDetailPage() {
  const { slug } = useParams();
  const [tema, setTema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getThemeBySlug(slug)
      .then(data => setTema(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400 mt-4">Carregando detalhes da palestra...</p>
      </div>
    );
  }

  if (error || !tema) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Tema Não Encontrado</h2>
        <p className="text-sm text-slate-400">O tema solicitado não existe ou está inativo no catálogo.</p>
        <Link
          to="/temas"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const defaultImages = {
    'financas-pessoais-e-liberdade-financeira': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    'investimentos-inteligentes-do-zero': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'educacao-financeira-jovens-universitarios': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    'gestao-fluxo-caixa-empresarial': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
  };

  const imageUrl = tema.imagem_url || defaultImages[tema.slug] || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Botão de Retorno */}
      <Link
        to="/temas"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para o Catálogo de Palestras
      </Link>

      {/* Banner Principal */}
      <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] flex items-end p-6 sm:p-12 border border-slate-800">
        <img
          src={imageUrl}
          alt={tema.titulo}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-brand-500/20 backdrop-blur-md text-brand-300 border border-brand-400/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tema.formatos}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700/80">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {tema.duracao_minutos} minutos
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {{ ...tema }.titulo}
          </h1>

          {tema.subtitulo && (
            <p className="text-sm sm:text-base font-semibold text-brand-300">
              {tema.subtitulo}
            </p>
          )}
        </div>
      </div>

      {/* Detalhes e Card de Contratação */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Coluna de Ementa */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Visão Geral e Objetivos
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {tema.descricao_curta}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Abordagem e Conteúdo Programático</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
              {tema.descricao_completa}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" />
              Público-Alvo Recomendado
            </h3>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-300">
              {tema.publico_alvo}
            </div>
          </div>

        </div>

        {/* Coluna Sticky de Agendamento */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="glass-card rounded-3xl p-7 border border-brand-500/30 space-y-6 shadow-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-1">
                Interesse nesta palestra?
              </span>
              <h3 className="text-xl font-bold text-white">Solicite sua Data</h3>
              <p className="text-xs text-slate-400 mt-1">
                Análise de disponibilidade de agenda sem compromisso.
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 border-y border-slate-800 py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Duração:</span>
                <strong className="text-white font-bold">{tema.duracao_minutos} minutos</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Modalidade:</span>
                <strong className="text-white font-bold">{tema.formatos}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Retorno da Proposta:</span>
                <strong className="text-brand-400 font-bold">Até 48h úteis</strong>
              </div>
            </div>

            <Link
              to={`/solicitar?tema=${tema.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-brand-400 to-teal-300 hover:from-brand-300 hover:to-teal-200 rounded-2xl shadow-lg shadow-brand-500/20 transition-all text-center"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              Solicitar Esta Palestra
            </Link>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Sem custos na solicitação &bull; LGPD Compliant</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

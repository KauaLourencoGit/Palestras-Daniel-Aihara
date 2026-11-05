import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, Video, MapPin, CheckCircle2 } from 'lucide-react';

export default function ThemeCard({ tema }) {
  // Imagens padrão de alta resolução de acordo com o tema se não fornecida
  const defaultImages = {
    'financas-pessoais-e-liberdade-financeira': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    'investimentos-inteligentes-do-zero': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    'educacao-financeira-jovens-universitarios': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'gestao-fluxo-caixa-empresarial': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  };

  const imageUrl = tema.imagem_url || defaultImages[tema.slug] || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Banner Fotográfico */}
        <div className="relative h-52 sm:h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={tema.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          {/* Badges superiores */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-brand-300 border border-brand-500/30 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              {tema.formatos}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700/60 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {tema.duracao_minutos} min
            </span>
          </div>

          {/* Subtítulo sobreposto no rodapé da imagem */}
          {tema.subtitulo && (
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 drop-shadow">
                {tema.subtitulo}
              </span>
            </div>
          )}
        </div>

        {/* Corpo do Card */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
            {tema.titulo}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
            {tema.descricao_curta}
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Users className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              <span>Público recomendado:</span>
            </div>
            <p className="text-xs text-slate-400 pl-5">
              {tema.publico_alvo}
            </p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="p-6 pt-0 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-4">
        <Link
          to={`/temas/${tema.slug}`}
          className="text-xs font-bold text-slate-300 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          Ementa completa <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/solicitar?tema=${tema.id}`}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl shadow-md transition-all"
        >
          Solicitar Palestra
        </Link>
      </div>
    </div>
  );
}

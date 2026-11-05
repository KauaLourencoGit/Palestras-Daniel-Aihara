import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

export default function ArticlesPage() {
  const artigos = [
    {
      slug: 'como-organizar-suas-financas-pessoais-do-zero',
      titulo: 'Como Organizar suas Finanças Pessoais do Zero: Guia Prático',
      resumo: 'Um passo a passo simples e direto para diagnosticar seus gastos, quitar dívidas e criar o hábito de poupar todos os meses.',
      data: '01/11/2026',
      tempo_leitura: '6 min',
      imagem_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      tags: ['Finanças Pessoais', 'Orçamento', 'Planejamento']
    },
    {
      slug: 'reserva-de-emergencia-onde-investir',
      titulo: 'Reserva de Emergência: Por que Você Precisa de Uma e Onde Investir',
      resumo: 'Entenda o conceito do colchão de segurança, quanto guardar e quais são as aplicações mais seguras com liquidez diária.',
      data: '28/10/2026',
      tempo_leitura: '5 min',
      imagem_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
      tags: ['Investimentos', 'Renda Fixa', 'Segurança']
    },
    {
      slug: 'principais-erros-ao-usar-o-cartao-de-credito',
      titulo: 'Os 5 Maiores Erros no Uso do Cartão de Crédito e Como Evitá-los',
      resumo: 'O cartão de crédito pode ser um grande aliado ou um acelerador de endividamento. Descubra como utilizá-lo a seu favor.',
      data: '20/10/2026',
      tempo_leitura: '4 min',
      imagem_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      tags: ['Cartão de Crédito', 'Dívidas', 'Hábitos']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-block">
          Artigos & Guias Educativos
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Educação Financeira Descomplicada
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Textos práticos e acessíveis preparados pelo palestrante Daniel Takeo Aihara para apoiar sua jornada rumo à estabilidade e autonomia financeira.
        </p>
      </div>

      {/* Grid de Artigos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {artigos.map(art => (
          <article
            key={art.slug}
            className="glass-card glass-card-hover rounded-3xl overflow-hidden group flex flex-col justify-between border border-slate-800"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={art.imagem_url}
                  alt={art.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-slate-300 border border-slate-700/60">
                  ⏱ {art.tempo_leitura}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{art.data}</span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                  <Link to={`/conteudos/${art.slug}`}>
                    {art.titulo}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {art.resumo}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {art.tags.map(t => (
                    <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-brand-400 border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 mt-4 border-t border-slate-800/80">
              <Link
                to={`/conteudos/${art.slug}`}
                className="text-xs font-bold text-brand-400 group-hover:text-brand-300 flex items-center gap-1.5 transition-colors"
              >
                Ler artigo completo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}

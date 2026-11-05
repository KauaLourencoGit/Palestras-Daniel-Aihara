import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react';
import ThemeCard from '../components/ThemeCard';
import SpeakerSpotlight from '../components/SpeakerSpotlight';
import TestimonialsSection from '../components/TestimonialsSection';
import { api } from '../services/api';

export default function HomePage() {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    api.getThemes()
      .then(data => setTemas(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const faqs = [
    {
      q: 'Com quanto tempo de antecedência devo solicitar uma data?',
      a: 'Recomendamos solicitar com pelo menos 7 dias de antecedência (a plataforma exige um mínimo de 7 dias e permite reservas até 18 meses adiante). Para eventos de grande porte ou SIPATs em datas concorridas, o ideal é solicitar com 30 a 60 dias de antecedência.'
    },
    {
      q: 'Daniel realiza palestras presenciais fora de Minas Gerais?',
      a: 'Sim! Daniel reside em Uberlândia — MG e viaja para palestras presenciais em capitais e cidades de todo o território nacional. Também realiza transmissões ao vivo de altíssima qualidade técnica para equipes remotas e híbridas.'
    },
    {
      q: 'Como é formulada a proposta comercial e o valor?',
      a: 'O valor da proposta é individualizado de acordo com o formato (presencial ou online), tempo de duração, localidade/deslocamento e público estimado. Após o envio do formulário, Daniel analisa a viabilidade e envia a proposta detalhada em até 48 horas úteis.'
    },
    {
      q: 'É possível customizar o tema da palestra para a realidade da minha empresa?',
      a: 'Com certeza! Antes da palestra, é realizado um alinhamento prévio para compreender as dores e objetivos específicos da sua equipe, adaptando dinâmicas e exemplos práticos para o perfil do seu público.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section de Alto Impacto Visual */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        
        {/* Imagem de Fundo com Máscara e Gradientes */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=2000&q=80"
            alt="Auditorium Stage Keynote"
            className="w-full h-full object-cover object-center opacity-25 filter brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Badge superior pulsante */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-500/40 text-brand-300 text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping"></span>
            Agenda Aberta para 2026/2027 &bull; Presencial e Online
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Educação Financeira que <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-teal-300 to-emerald-400">
              Transforma Comportamentos
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Palestras envolventes e sem jargões complexos para convenções, SIPATs, empresas e universidades. Leve clareza, alívio de estresse e inteligência orçamentária para a sua equipe.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/solicitar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-extrabold text-slate-950 bg-gradient-to-r from-brand-400 to-teal-300 hover:from-brand-300 hover:to-teal-200 rounded-2xl shadow-xl shadow-brand-500/25 transform hover:-translate-y-1 transition-all"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              Solicitar Palestra para seu Evento
            </Link>

            <Link
              to="/temas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white glass-card hover:bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-brand-500/40 transition-all"
            >
              <Layers className="w-5 h-5 text-brand-400" />
              Conhecer Catálogo de Temas
            </Link>
          </div>

          {/* Indicadores de Autoridade */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-brand-400 block">+120</span>
              <span className="text-xs text-slate-400 font-medium">Palestras Realizadas</span>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-brand-400 block">+5.000</span>
              <span className="text-xs text-slate-400 font-medium">Pessoas Capacitadas</span>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-brand-400 block">98.4%</span>
              <span className="text-xs text-slate-400 font-medium">Índice de Aprovação</span>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-brand-400 block">100%</span>
              <span className="text-xs text-slate-400 font-medium">Prático e Aplicável</span>
            </div>
          </div>

        </div>
      </section>

      {/* Catálogo de Palestras em Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-block mb-3">
              Catálogo de Temas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Palestras Disponíveis para Contratação
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Formatos flexíveis para empresas, SIPATs, faculdades e convenções empresariais.
            </p>
          </div>
          <Link
            to="/temas"
            className="text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 whitespace-nowrap"
          >
            Ver todas as ementas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-96 rounded-3xl glass-card animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {temas.map(tema => (
              <ThemeCard key={tema.id} tema={tema} />
            ))}
          </div>
        )}
      </section>

      {/* Destaque do Palestrante Daniel Takeo Aihara */}
      <SpeakerSpotlight />

      {/* Depoimentos e Prova Social */}
      <TestimonialsSection />

      {/* Destaques de Conteúdos & Dicas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Aprenda Gratuitamente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Artigos e Reflexões de Educação Financeira
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Conteúdos práticos preparados pelo Daniel para transformar sua organização financeira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/conteudos/como-organizar-suas-financas-pessoais-do-zero"
            className="glass-card glass-card-hover rounded-3xl overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
                alt="Como Organizar Finanças"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs text-brand-400 font-semibold block">⏱ 6 min de leitura</span>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Como Organizar suas Finanças Pessoais do Zero: Guia Prático
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3">
                Um passo a passo simples e direto para diagnosticar seus gastos, quitar dívidas e criar o hábito de poupar.
              </p>
            </div>
            <div className="p-6 pt-0 text-xs font-bold text-brand-400 flex items-center gap-1">
              Ler artigo &rarr;
            </div>
          </Link>

          <Link
            to="/conteudos/reserva-de-emergencia-onde-investir"
            className="glass-card glass-card-hover rounded-3xl overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
                alt="Reserva de Emergência"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs text-brand-400 font-semibold block">⏱ 5 min de leitura</span>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Reserva de Emergência: Por que Você Precisa de Uma e Onde Investir
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3">
                Entenda o conceito do colchão de segurança, quanto guardar e quais são as aplicações mais seguras com liquidez diária.
              </p>
            </div>
            <div className="p-6 pt-0 text-xs font-bold text-brand-400 flex items-center gap-1">
              Ler artigo &rarr;
            </div>
          </Link>

          <Link
            to="/conteudos/principais-erros-ao-usar-o-cartao-de-credito"
            className="glass-card glass-card-hover rounded-3xl overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
                alt="Cartão de Crédito"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs text-brand-400 font-semibold block">⏱ 4 min de leitura</span>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Os 5 Maiores Erros no Uso do Cartão de Crédito e Como Evitá-los
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3">
                O cartão pode ser um aliado ou um acelerador de endividamento. Descubra como utilizá-lo a seu favor.
              </p>
            </div>
            <div className="p-6 pt-0 text-xs font-bold text-brand-400 flex items-center gap-1">
              Ler artigo &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* Perguntas Frequentes (FAQ Interativo) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Dúvidas Comuns
          </span>
          <h2 className="text-3xl font-extrabold text-white">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-brand-300 transition-colors"
                >
                  <span>{f.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Banner Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-brand-900 via-teal-900 to-slate-900 border border-brand-500/30 shadow-2xl text-center space-y-6">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Pronto para levar essa transformação para a sua instituição?
          </h2>
          <p className="text-base text-brand-100 max-w-2xl mx-auto">
            Preencha a solicitação em menos de 2 minutos. Receba uma proposta personalizada sem compromisso com análise de disponibilidade em até 48 horas.
          </p>
          <div className="pt-4">
            <Link
              to="/solicitar"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-extrabold text-slate-950 bg-white hover:bg-brand-50 rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              Preencher Solicitação de Palestra Agora
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

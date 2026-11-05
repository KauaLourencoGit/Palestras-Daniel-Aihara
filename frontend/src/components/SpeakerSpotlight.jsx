import React from 'react';
import { Award, CheckCircle, TrendingUp, Sparkles, BookOpen, HeartHandshake } from 'lucide-react';

export default function SpeakerSpotlight() {
  const pilares = [
    {
      icon: TrendingUp,
      titulo: 'Sem "Financês" ou Fórmulas Mágicas',
      descricao: 'Metodologias práticas e exemplos do cotidiano brasileiro para que qualquer pessoa compreenda e aplique no mesmo dia.'
    },
    {
      icon: Award,
      titulo: 'Independência e Isenção Total',
      descricao: 'As palestras não vendem investimentos ou produtos bancários. O único compromisso é com o bem-estar e autonomia financeira do participante.'
    },
    {
      icon: HeartHandshake,
      titulo: 'Saúde Mental & Produtividade',
      descricao: 'O endividamento e a desorganização são os maiores causadores de ansiedade e perda de foco nas empresas. Cuidamos do ser humano por trás do crachá.'
    },
    {
      icon: BookOpen,
      titulo: 'Didática Adaptável e Interativa',
      descricao: 'Abordagens personalizadas para colaboradores de linha de frente, executivos, estudantes universitários ou jovens aprendizes.'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Foto e Card com Destaque Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Moldura com gradiente brilhante */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-500 via-teal-500 to-emerald-700 rounded-3xl blur-lg opacity-40"></div>
              
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80"
                  alt="Daniel Takeo Aihara em Palestra"
                  className="w-full h-[460px] object-cover object-top filter brightness-95"
                />
                
                {/* Overlay com informações de autoridade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 backdrop-blur-md text-brand-300 border border-brand-400/30 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Educador & Consultor Financeiro
                  </div>
                  <h3 className="text-2xl font-black text-white">Daniel Takeo Aihara</h3>
                  <p className="text-xs text-slate-300">
                    Uberlândia — MG &bull; Atuação presencial em todo o Brasil e transmissão online internacional.
                  </p>
                </div>
              </div>

              {/* Badge flutuante de Avaliação */}
              <div className="absolute -bottom-6 -right-4 bg-slate-900/90 backdrop-blur-md border border-brand-500/30 rounded-2xl p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 font-black text-lg">
                    ★
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Índice de Aprovação</span>
                    <strong className="text-white text-base font-extrabold">98.4% NPS</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Conteúdo Biográfico e Pilares */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-block">
                Sobre o Palestrante
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Transformando a relação das pessoas com o dinheiro através do conhecimento prático
              </h2>
              <p className="text-base text-slate-300 leading-relaxed pt-2">
                Com ampla trajetória na área financeira e foco em educação preventiva, <strong>Daniel Takeo Aihara</strong> construiu uma didática única que afasta a frieza dos números e aproxima a disciplina orçamentária dos sonhos reais de cada pessoa e família.
              </p>
            </div>

            {/* Grid dos 4 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pilares.map((p, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{p.titulo}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.descricao}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

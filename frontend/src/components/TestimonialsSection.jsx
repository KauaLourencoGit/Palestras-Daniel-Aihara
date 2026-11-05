import React from 'react';
import { Star, Building2, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const depoimentos = [
    {
      nome: 'Mariana Oliveira',
      cargo: 'Gerente de Recursos Humanos',
      empresa: 'Grupo Voga Logística',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      texto: 'A palestra do Daniel na nossa SIPAT superou todas as expectativas. Os colaboradores elogiaram a linguagem simples e como os exemplos se aplicavam diretamente à realidade de quem ganha salário fixo. Já agendamos a segunda edição!'
    },
    {
      nome: 'Ricardo Martins',
      cargo: 'Diretor de Eventos Corporativos',
      empresa: 'Instituto Inovação & Gestão',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      texto: 'Profissionalismo impecável desde o primeiro contato no site até a execução no palco. O Daniel tem um domínio de palco impressionante e prendeu a atenção de 400 pessoas por quase duas horas sem ficar cansativo.'
    },
    {
      nome: 'Fernanda Carvalho',
      cargo: 'Coordenadora Pedagógica',
      empresa: 'Faculdade Triângulo',
      foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      texto: 'A palestra para os formandos sobre início de carreira e armadilhas do cartão de crédito abriu a mente dos alunos. Um conteúdo essencial que infelizmente não é ensinado na grade tradicional de ensino.'
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Prova Social & Avaliações
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            O que dizem os contratantes e participantes
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Feedback real de quem já levou as palestras do Daniel para sua equipe ou instituição.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {depoimentos.map((d, i) => (
            <div key={i} className="glass-card rounded-3xl p-7 border border-slate-800 flex flex-col justify-between relative group hover:border-brand-500/30 transition-all">
              <Quote className="w-10 h-10 text-brand-500/10 absolute top-6 right-6 pointer-events-none group-hover:text-brand-500/20 transition-colors" />
              
              <div className="space-y-4">
                {/* 5 Estrelas */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{d.texto}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3.5">
                <img
                  src={d.foto}
                  alt={d.nome}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{d.nome}</h4>
                  <p className="text-xs text-slate-400">{d.cargo}</p>
                  <span className="text-[11px] font-semibold text-brand-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    {d.empresa}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

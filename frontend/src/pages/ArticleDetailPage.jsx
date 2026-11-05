import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Sparkles } from 'lucide-react';

export default function ArticleDetailPage() {
  const { slug } = useParams();

  // Artigos formatados
  const artigosDatabase = {
    'como-organizar-suas-financas-pessoais-do-zero': {
      titulo: 'Como Organizar suas Finanças Pessoais do Zero: Guia Prático',
      data: '01/11/2026',
      tempo_leitura: '6 min',
      autor: 'Daniel Takeo Aihara',
      imagem_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      resumo: 'Um passo a passo simples e direto para diagnosticar seus gastos, quitar dívidas e criar o hábito de poupar todos os meses.',
      conteudo: [
        {
          tipo: 'h2',
          texto: 'O ponto de partida: diagnóstico financeiro'
        },
        {
          tipo: 'p',
          texto: 'Muitas pessoas acreditam que organizar a vida financeira exige planilhas mirabolantes ou fórmulas matemáticas complexas. Na prática, a organização financeira começa com uma pergunta simples: para onde vai o seu dinheiro todos os meses?'
        },
        {
          tipo: 'p',
          texto: 'Antes de cortar qualquer despesa, é essencial registrar durante 30 dias todas as entradas e saídas. Isso inclui desde a parcela do aluguel ou financiamento até os pequenos gastos diários com café, transporte por aplicativo e assinaturas de streaming pouco utilizadas.'
        },
        {
          tipo: 'h2',
          texto: 'A Regra 50-30-20 adaptada à realidade brasileira'
        },
        {
          tipo: 'p',
          texto: 'Uma das metodologias mais eficientes para equilibrar o orçamento é a divisão em três pilares fundamentais:'
        },
        {
          tipo: 'ul',
          itens: [
            '50% para Necessidades Básicas: moradia, alimentação básica, saúde, energia, água e transporte essencial.',
            '30% para Qualidade de Vida e Lazer: restaurantes, momentos de lazer, hobbies e compras pessoais controladas.',
            '20% para Metas e Futuro: quitação acelerada de dívidas com juros altos, montagem da reserva de emergência e investimentos.'
          ]
        },
        {
          tipo: 'quote',
          texto: 'Dica do Daniel: Se o seu custo fixo hoje ultrapassa 50%, não se desespere. O segredo é fazer ajustes graduais mês a mês até aproximar sua realidade desse padrão sem sacrificar sua saúde mental.'
        },
        {
          tipo: 'h2',
          texto: '3 passos imediatos para começar hoje'
        },
        {
          tipo: 'ul',
          itens: [
            'Identifique os gastos invisíveis: Revise a fatura do cartão e o extrato bancário. Cancele serviços que você não utiliza há mais de 60 dias.',
            'Negocie dívidas caras: Juros de cheque especial e rotativo do cartão de crédito crescem exponencialmente. Troque dívidas caras por linhas de crédito consignado ou empréstimos com taxas menores.',
            'Defina objetivos claros: Economizar por economizar perde o sentido com facilidade. Guarde dinheiro com propósitos definidos: tranquilidade familiar, reforma da casa ou liberdade no futuro.'
          ]
        }
      ]
    },
    'reserva-de-emergencia-onde-investir': {
      titulo: 'Reserva de Emergência: Por que Você Precisa de Uma e Onde Investir',
      data: '28/10/2026',
      tempo_leitura: '5 min',
      autor: 'Daniel Takeo Aihara',
      imagem_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
      resumo: 'Entenda o conceito do colchão de segurança, quanto guardar e quais são as aplicações mais seguras com liquidez diária.',
      conteudo: [
        {
          tipo: 'h2',
          texto: 'O que é a Reserva de Emergência?'
        },
        {
          tipo: 'p',
          texto: 'A reserva de emergência é a quantia em dinheiro guardada exclusivamente para cobrir imprevistos da vida real: uma despesa médica não planejada, o conserto urgente do veículo de trabalho, um reparo doméstico ou a perda temporária de renda.'
        },
        {
          tipo: 'p',
          texto: 'Ela não foi feita para multiplicar capital ou gerar fortunas; o objetivo primordial da reserva é trazer paz de espírito e evitar o endividamento diante do imprevisto.'
        },
        {
          tipo: 'h2',
          texto: 'Quanto devo guardar na reserva?'
        },
        {
          tipo: 'ul',
          itens: [
            'Para assalariados (CLT com estabilidade): de 3 a 6 meses do seu custo de vida mensal médio.',
            'Para autônomos, empresários e profissionais liberais: de 6 a 12 meses do custo de vida mensal, devido à natural volatilidade dos rendimentos.'
          ]
        },
        {
          tipo: 'h2',
          texto: 'Onde aplicar o dinheiro da reserva de emergência?'
        },
        {
          tipo: 'p',
          texto: 'A aplicação da reserva deve obedecer a três regras inegociáveis: baixíssimo risco, liquidez imediata (D+0 ou D+1) e rentabilidade acompanhando a taxa Selic.'
        },
        {
          tipo: 'quote',
          texto: 'As melhores alternativas no Brasil hoje são o Tesouro Selic (Tesouro Direto) e CDBs com liquidez diária emitidos por bancos sólidos pagando 100% ou mais do CDI com garantia do FGC.'
        }
      ]
    },
    'principais-erros-ao-usar-o-cartao-de-credito': {
      titulo: 'Os 5 Maiores Erros no Uso do Cartão de Crédito e Como Evitá-los',
      data: '20/10/2026',
      tempo_leitura: '4 min',
      autor: 'Daniel Takeo Aihara',
      imagem_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      resumo: 'O cartão de crédito pode ser um grande aliado ou um acelerador de endividamento. Descubra como utilizá-lo a seu favor.',
      conteudo: [
        {
          tipo: 'h2',
          texto: 'Vilão ou Ferramenta?'
        },
        {
          tipo: 'p',
          texto: 'O cartão de crédito não é, por si só, um problema. Ele é um meio de pagamento que oferece praticidade, segurança e benefícios. O problema surge quando ele é encarado como uma extensão de renda.'
        },
        {
          tipo: 'h2',
          texto: 'Erros capitais que você deve evitar'
        },
        {
          tipo: 'ul',
          itens: [
            'Pagar apenas o valor mínimo da fatura: O rotativo no Brasil passa de 400% ao ano. Pagar o mínimo transforma compras triviais em dívidas impagáveis.',
            'Parcelar compras de consumo imediato: Comida e combustível devem ser pagos à vista ou no débito.',
            'Ter limite desproporcional à renda: Limite maior que duas vezes o salário cria a ilusão perigosa de poder aquisitivo.',
            'Não acompanhar as faturas semanalmente: Ative alertas no aplicativo do banco para cada compra realizada.'
          ]
        }
      ]
    }
  };

  const artigo = artigosDatabase[slug];

  if (!artigo) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Artigo Não Encontrado</h2>
        <p className="text-sm text-slate-400">O artigo solicitado não existe ou está em rascunho.</p>
        <Link
          to="/conteudos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos Artigos
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <Link
        to="/conteudos"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a lista de artigos
      </Link>

      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-end p-6 sm:p-10 border border-slate-800">
        <img
          src={artigo.imagem_url}
          alt={artigo.titulo}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-bold text-brand-300 bg-brand-500/20 px-2.5 py-0.5 rounded-full border border-brand-500/30">
              {artigo.autor}
            </span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {artigo.data}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {artigo.tempo_leitura}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {artigo.titulo}
          </h1>
        </div>
      </div>

      {/* Corpo do Artigo */}
      <div className="glass-card rounded-3xl p-6 sm:p-12 border border-slate-800 space-y-6 text-slate-300 leading-relaxed">
        {artigo.conteudo.map((bloco, idx) => {
          if (bloco.tipo === 'h2') {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800/80 first:border-0 first:pt-0">
                {bloco.texto}
              </h2>
            );
          }
          if (bloco.tipo === 'p') {
            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed">
                {bloco.texto}
              </p>
            );
          }
          if (bloco.tipo === 'ul') {
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                {bloco.itens.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          }
          if (bloco.tipo === 'quote') {
            return (
              <blockquote key={idx} className="border-l-4 border-brand-500 pl-4 py-3 bg-brand-500/10 rounded-r-2xl italic text-sm text-brand-200 my-4">
                "{bloco.texto}"
              </blockquote>
            );
          }
          return null;
        })}
      </div>

      {/* Box de Palestra */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-slate-900 to-slate-950 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-white">Leve essa transformação para sua empresa</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Daniel ministra palestras interativas adaptadas aos objetivos da sua equipe.
          </p>
        </div>
        <Link
          to="/solicitar"
          className="whitespace-nowrap px-6 py-3.5 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md"
        >
          Solicitar Palestra com o Daniel
        </Link>
      </div>

    </article>
  );
}

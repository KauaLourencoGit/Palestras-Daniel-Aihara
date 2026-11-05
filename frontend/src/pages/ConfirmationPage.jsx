import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Check, Copy, CheckCircle2, ArrowRight, Home, Layers, Info } from 'lucide-react';

export default function ConfirmationPage() {
  const { protocolo } = useParams();
  const [searchParams] = useSearchParams();
  const isDuplicada = searchParams.get('duplicada') === '1';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(protocolo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Banner Superior com Sucesso */}
        <div className="bg-gradient-to-r from-brand-700 via-teal-700 to-emerald-800 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mx-auto shadow-lg">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Solicitação Registrada com Sucesso!
          </h1>
          <p className="text-brand-100 text-xs sm:text-sm max-w-md mx-auto">
            {isDuplicada ? (
              'Identificamos que este pedido já havia sido enviado recentemente. Seu protocolo anterior foi mantido.'
            ) : (
              'Obrigado pelo interesse! Daniel analisará a viabilidade logística e retornará por e-mail em até 48 horas úteis.'
            )}
          </p>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Box de Protocolo */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Seu Código de Protocolo Único
            </span>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-700">
              <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-brand-400 select-all">
                {protocolo}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Copiar Protocolo"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-brand-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && (
              <span className="text-xs text-brand-400 block font-semibold">
                Protocolo copiado para a área de transferência!
              </span>
            )}
            <p className="text-xs text-slate-500">
              Guarde este código para qualquer consulta ou acompanhamento de proposta.
            </p>
          </div>

          {/* Alerta de Disponibilidade de Agenda (RF-10, RN-15) */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-amber-300 font-bold mb-0.5">Aviso Importante sobre a Agenda:</strong>
              A data indicada no formulário depende de confirmação prévia de viabilidade de agenda. A reserva definitiva só é formalizada após o envio e aceite formal da proposta com o Daniel.
            </div>
          </div>

          {/* Navegação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800/80">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-300 glass-card hover:bg-slate-800 rounded-xl transition-all"
            >
              <Home className="w-4 h-4" /> Voltar à Página Inicial
            </Link>
            <Link
              to="/temas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all"
            >
              <Layers className="w-4 h-4" /> Ver Outras Palestras
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

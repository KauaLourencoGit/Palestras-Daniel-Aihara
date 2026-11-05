import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare, AlertCircle, CheckCircle2, History, Phone, Mail, Building, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalAcao, setModalAcao] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [feedback, setFeedback] = useState(null);

  const carregarDados = () => {
    setLoading(true);
    Promise.all([
      api.getRequestById(id),
      api.getRequestHistory(id)
    ])
      .then(([sol, hist]) => {
        setSolicitacao(sol);
        setHistorico(hist);
      })
      .catch(err => {
        if (err.status === 401) navigate('/admin/login');
        setFeedback({ tipo: 'erro', texto: err.message });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const handleExecutarAcao = async (acaoNome, exigeMotivo = false) => {
    if (exigeMotivo && (!motivo.trim() || motivo.trim().length < 3)) {
      setFeedback({ tipo: 'erro', texto: 'Informe uma justificativa com no mínimo 3 caracteres para registrar no histórico.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      await api.executeAction(id, acaoNome, solicitacao.versao, motivo || null);
      setModalAcao(null);
      setMotivo('');
      setFeedback({ tipo: 'sucesso', texto: `Status atualizado com sucesso!` });
      carregarDados();
    } catch (err) {
      setFeedback({ tipo: 'erro', texto: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !solicitacao) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 mt-3">Carregando detalhes do pedido...</p>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Solicitação Não Encontrada</h2>
        <Link to="/admin" className="text-brand-400 text-xs font-bold">&larr; Voltar ao painel</Link>
      </div>
    );
  }

  const cleanPhone = solicitacao.telefone ? solicitacao.telefone.replace(/\D/g, '') : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar à Lista de Solicitações
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-mono font-black text-brand-400">
              {solicitacao.protocolo}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Status: {solicitacao.status}
            </span>
            <span className="text-xs text-slate-500">
              Versão: v{solicitacao.versao}
            </span>
          </div>
        </div>

        {cleanPhone && (
          <a
            href={`https://wa.me/55${cleanPhone}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
          >
            <MessageSquare className="w-4 h-4 text-slate-950" /> Conversar no WhatsApp
          </a>
        )}
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border ${
          feedback.tipo === 'sucesso' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-red-950/60 border-red-500 text-red-200'
        }`}>
          {feedback.tipo === 'sucesso' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
          <span>{feedback.texto}</span>
        </div>
      )}

      {/* Barra de Transição de Status (Máquina de Estados - RN-03) */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ações do Funil de Atendimento
          </h2>
          <p className="text-xs text-slate-500">
            Transições disponíveis para o status atual <strong>{solicitacao.status}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-1">
          {solicitacao.status === 'NOVA' && (
            <>
              <button
                disabled={actionLoading}
                onClick={() => handleExecutarAcao('assumir')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all cursor-pointer"
              >
                Assumir Análise
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setModalAcao({ acao: 'recusar', titulo: 'Recusar Solicitação' })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
              >
                Recusar Pedido...
              </button>
            </>
          )}

          {solicitacao.status === 'EM_ANALISE' && (
            <>
              <button
                disabled={actionLoading}
                onClick={() => handleExecutarAcao('propor')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-indigo-400 hover:bg-indigo-300 shadow-md transition-all cursor-pointer"
              >
                Registrar Proposta (Pré-Reserva)
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setModalAcao({ acao: 'recusar', titulo: 'Recusar Solicitação' })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
              >
                Recusar Pedido...
              </button>
            </>
          )}

          {solicitacao.status === 'PROPOSTA_ENVIADA' && (
            <>
              <button
                disabled={actionLoading}
                onClick={() => handleExecutarAcao('confirmar')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all cursor-pointer"
              >
                Confirmar Palestra
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setModalAcao({ acao: 'retirar', titulo: 'Retirar Proposta' })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
              >
                Retirar Proposta
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setModalAcao({ acao: 'recusar', titulo: 'Recusar Solicitação' })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
              >
                Recusar Pedido...
              </button>
            </>
          )}

          {solicitacao.status === 'CONFIRMADA' && (
            <>
              <button
                disabled={actionLoading}
                onClick={() => handleExecutarAcao('realizar')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 transition-all cursor-pointer"
              >
                Marcar Realizada
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setModalAcao({ acao: 'cancelar', titulo: 'Cancelar Palestra Confirmada' })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer"
              >
                Cancelar Palestra...
              </button>
            </>
          )}

          {['REALIZADA', 'RECUSADA', 'CANCELADA'].includes(solicitacao.status) && (
            <span className="text-xs text-slate-500 italic">
              Esta solicitação atingiu o estado final ({solicitacao.status}) e não permite novas transições de status.
            </span>
          )}
        </div>
      </div>

      {/* Grid de Dados e Histórico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Detalhes da Solicitação */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Dados do Contratante</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Organização / Instituição:</span>
              <strong className="text-white text-base font-bold">{solicitacao.organizacao}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Pessoa de Contato:</span>
              <strong className="text-white">{solicitacao.nome_contato}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">E-mail:</span>
              <a href={`mailto:${solicitacao.email}`} className="text-brand-400 hover:underline">
                {solicitacao.email}
              </a>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Telefone:</span>
              <span className="text-slate-200">{solicitacao.telefone || 'Não informado'}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Dados do Evento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Data Desejada:</span>
                <strong className="text-brand-400 text-base font-bold">
                  {new Date(solicitacao.data_desejada + 'T00:00:00').toLocaleDateString('pt-BR')}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Data Alternativa:</span>
                <span className="text-slate-200">
                  {solicitacao.data_alternativa ? new Date(solicitacao.data_alternativa + 'T00:00:00').toLocaleDateString('pt-BR') : 'Nenhuma'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Local:</span>
                <span className="text-slate-200">{solicitacao.cidade}/{solicitacao.estado}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Formato:</span>
                <span className="text-slate-200">{solicitacao.formato}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Perfil do Público:</span>
                <span className="text-slate-200">{solicitacao.perfil_publico}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Público Estimado:</span>
                <span className="text-slate-200">{solicitacao.publico_estimado || 'Não estimado'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-xs">Tema Escolhido:</span>
                <strong className="text-white text-sm">{solicitacao.tema_titulo || 'Tema Aberto / A Definir'}</strong>
              </div>
            </div>
          </div>

          {solicitacao.mensagem && (
            <div className="border-t border-slate-800 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mensagem do Contratante</h3>
              <p className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {solicitacao.mensagem}
              </p>
            </div>
          )}
        </div>

        {/* Linha do Tempo Imutável (RN-12, RNF-02) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <History className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Histórico Auditável</h3>
          </div>

          <div className="space-y-4">
            {historico.map(ev => (
              <div key={ev.id} className="relative pl-6 pb-4 border-l-2 border-slate-800 last:border-0 last:pb-0">
                <div className="w-3 h-3 rounded-full bg-brand-500 absolute -left-[7px] top-1"></div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{new Date(ev.criado_em).toLocaleDateString('pt-BR')} às {new Date(ev.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-bold text-slate-400 uppercase">{ev.autor}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-200">
                    {ev.acao}: {ev.status_anterior ? `${ev.status_anterior} ➔ ` : ''}<span className="text-brand-400">{ev.status_novo}</span>
                  </div>

                  {ev.motivo && (
                    <p className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 italic mt-1">
                      "{ev.motivo}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal para Ações que Exigem Motivo (RN-09) */}
      {modalAcao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-800 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">{modalAcao.titulo}</h3>
            <p className="text-xs text-slate-400">
              Esta ação exige justificativa para registro permanente no histórico (RN-09).
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Motivo / Justificativa <span className="text-red-400">*</span>
              </label>
              <textarea
                rows="3"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Informe o motivo da recusa ou cancelamento..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none"
              ></textarea>
              <span className="text-[11px] text-slate-500 block mt-1">Mínimo 3 caracteres.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalAcao(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleExecutarAcao(modalAcao.acao, true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

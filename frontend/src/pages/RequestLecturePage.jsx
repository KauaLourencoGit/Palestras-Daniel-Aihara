import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Calendar, Building, User, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function RequestLecturePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const temaParam = searchParams.get('tema');

  const [temas, setTemas] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  // Calcula a data mínima (hoje + 7 dias - RN-02)
  const hoje = new Date();
  hoje.setDate(hoje.getDate() + 7);
  const minDataIso = hoje.toISOString().split('T')[0];
  const minDataFormatada = hoje.toLocaleDateString('pt-BR');

  const [form, setForm] = useState({
    organizacao: '',
    nome_contato: '',
    email: '',
    telefone: '',
    data_desejada: '',
    data_alternativa: '',
    cidade: '',
    estado: 'MG',
    formato: 'PRESENCIAL',
    perfil_publico: '',
    publico_estimado: '',
    tema_id: temaParam || '',
    mensagem: '',
    consentimento: false,
    website: '' // honeypot (RN-16)
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    api.getThemes()
      .then(data => setTemas(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpa erro do campo alterado
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErros = {};
    if (!form.organizacao.trim() || form.organizacao.trim().length < 2) {
      newErros.organizacao = 'Informe a organização ou empresa (mínimo 2 caracteres).';
    }
    if (!form.nome_contato.trim() || form.nome_contato.trim().length < 2) {
      newErros.nome_contato = 'Informe o nome do contato responsável.';
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      newErros.email = 'Informe um e-mail válido para retorno.';
    }
    if (!form.data_desejada) {
      newErros.data_desejada = `Informe a data desejada (mínimo a partir de ${minDataFormatada}).`;
    } else if (form.data_desejada < minDataIso) {
      newErros.data_desejada = `A data deve ter antecedência mínima de 7 dias (a partir de ${minDataFormatada}).`;
    }
    if (!form.cidade.trim()) {
      newErros.cidade = 'Informe a cidade de realização.';
    }
    if (!form.estado || form.estado.length !== 2) {
      newErros.estado = 'Informe o estado (UF) com 2 letras.';
    }
    if (!form.perfil_publico.trim()) {
      newErros.perfil_publico = 'Descreva brevemente o público (ex.: Colaboradores de RH, Universitários).';
    }
    if (!form.consentimento) {
      newErros.consentimento = 'É necessário concordar com o termo de consentimento LGPD para prosseguir.';
    }

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      // Scroll suave até o primeiro erro
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tema_id: form.tema_id ? parseInt(form.tema_id, 10) : null,
        publico_estimado: form.publico_estimado ? parseInt(form.publico_estimado, 10) : null,
        data_alternativa: form.data_alternativa || null,
        telefone: form.telefone || null,
        mensagem: form.mensagem || null,
      };

      const res = await api.submitRequest(payload);

      // Efeito de confetes no envio com sucesso
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      // Redireciona para tela de confirmação
      navigate(`/confirmacao/${res.protocolo}${res.duplicada ? '?duplicada=1' : ''}`);
    } catch (err) {
      setGeneralError(err.message || 'Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Título e Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-block">
          Atendimento Direto
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Solicitar Palestra ou Workshop
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Preencha os dados do evento abaixo. Você receberá um protocolo único e o Daniel retornará com a proposta em até 48 horas úteis.
        </p>
      </div>

      {generalError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Atenção ao enviar:</strong>
            <span>{generalError}</span>
          </div>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8" noValidate>
        
        {/* Campo Honeypot Oculto (RN-16) */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {/* Bloco 1: Contratante & Organização */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-black text-xs flex items-center justify-center">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dados da Organização e Contato</h2>
              <p className="text-xs text-slate-400">Identificação da instituição responsável pelo convite.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nome da Empresa / Escola / Instituição <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="organizacao"
                value={form.organizacao}
                onChange={handleChange}
                placeholder="Ex.: ACME Corporation, Colégio Objetivo, Prefeitura Municipal"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                  erros.organizacao ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all`}
              />
              {erros.organizacao && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{erros.organizacao}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nome do Responsável / Contato <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nome_contato"
                value={form.nome_contato}
                onChange={handleChange}
                placeholder="Ex.: Mariana Oliveira"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                  erros.nome_contato ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all`}
              />
              {erros.nome_contato && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{erros.nome_contato}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                E-mail Profissional para Retorno <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mariana@empresa.com.br"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                  erros.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all`}
              />
              {erros.email && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{erros.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Telefone / WhatsApp com DDD
              </label>
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(34) 99999-0000"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Formato Pretendido <span className="text-red-400">*</span>
              </label>
              <select
                name="formato"
                value={form.formato}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none"
              >
                <option value="PRESENCIAL">Presencial (no seu local/auditório)</option>
                <option value="ONLINE">Online (Transmissão ao Vivo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 2: Local e Datas */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-black text-xs flex items-center justify-center">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Datas e Localidade</h2>
              <p className="text-xs text-slate-400">
                Janela mínima de antecedência: a partir de <strong>{minDataFormatada}</strong> (7 dias de antecedência - RN-02).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Cidade <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Ex.: Uberlândia, São Paulo, Brasília"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                  erros.cidade ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all`}
              />
              {erros.cidade && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{erros.cidade}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Estado (UF) <span className="text-red-400">*</span>
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none"
              >
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Data Desejada Principal <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="data_desejada"
                min={minDataIso}
                value={form.data_desejada}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                  erros.data_desejada ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } text-sm text-white focus:border-brand-500 outline-none transition-all`}
              />
              {erros.data_desejada && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{erros.data_desejada}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Segunda Opção de Data (Opcional)
              </label>
              <input
                type="date"
                name="data_alternativa"
                min={minDataIso}
                value={form.data_alternativa}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Tema e Público */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-black text-xs flex items-center justify-center">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tema e Perfil do Público</h2>
              <p className="text-xs text-slate-400">Informações pedagógicas para calibração da apresentação.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Tema de Interesse no Catálogo
              </label>
              <select
                name="tema_id"
                value={form.tema_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-brand-500 outline-none"
              >
                <option value="">— Tema Aberto / Definir com o Daniel —</option>
                {temas.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.titulo} ({t.duracao_minutos} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Perfil do Público <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="perfil_publico"
                value={form.perfil_publico}
                onChange={handleChange}
                placeholder="Ex.: Colaboradores operacionais, liderança, universitários"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                  erros.perfil_publico ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700'
                } text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all`}
              />
              {erros.perfil_publico && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{erros.perfil_publico}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Público Estimado (Quantidade)
              </label>
              <input
                type="number"
                name="publico_estimado"
                min="1"
                max="100000"
                value={form.publico_estimado}
                onChange={handleChange}
                placeholder="Ex.: 80"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Mensagem ou Necessidades Específicas (Opcional)
              </label>
              <textarea
                name="mensagem"
                rows="3"
                value={form.mensagem}
                onChange={handleChange}
                placeholder="Conte-nos sobre o evento, tema da convenção, dores principais da equipe..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-all"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Termo de Consentimento LGPD (RN-01, P-08) */}
        <div className={`p-5 rounded-2xl border ${
          erros.consentimento ? 'bg-red-950/30 border-red-500' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentimento"
              checked={form.consentimento}
              onChange={handleChange}
              className="w-5 h-5 mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Termo de Consentimento e Privacidade (LGPD) <span className="text-red-400">*</span></strong>
              Concordo que os dados informados sejam utilizados exclusivamente pelo palestrante Daniel Takeo Aihara para responder a esta solicitação. Seus dados não são compartilhados com terceiros e são mantidos com total segurança.
            </span>
          </label>
          {erros.consentimento && (
            <p className="text-xs text-red-400 mt-2 font-medium pl-8">{erros.consentimento}</p>
          )}
        </div>

        {/* Botão de Envio */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Campos com <span className="text-red-400">*</span> são obrigatórios.
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-extrabold text-slate-950 bg-gradient-to-r from-brand-400 to-teal-300 hover:from-brand-300 hover:to-teal-200 rounded-2xl shadow-xl shadow-brand-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? (
              <span>Enviando solicitação...</span>
            ) : (
              <>
                <Calendar className="w-5 h-5 text-slate-950" />
                <span>Enviar Solicitação de Palestra</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}

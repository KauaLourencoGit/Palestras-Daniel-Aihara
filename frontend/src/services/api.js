const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Inclui cookies de sessão (HttpOnly)
  };

  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.detail?.mensagem || data.detail || data.message || 'Erro ao processar requisição';
    const error = new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Públicos
  getThemes: () => request('/publico/temas'),
  getThemeBySlug: (slug) => request(`/publico/temas/${slug}`),
  submitRequest: (payload) => request('/publico/solicitacoes', { method: 'POST', body: payload }),

  // Auth
  login: (email, senha) => request('/auth/login', { method: 'POST', body: { email, senha } }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Gestão / Admin
  getRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/solicitacoes${query ? `?${query}` : ''}`);
  },
  getRequestById: (id) => request(`/solicitacoes/${id}`),
  getRequestHistory: (id) => request(`/solicitacoes/${id}/historico`),
  executeAction: (id, acao, versao, motivo = null) =>
    request(`/solicitacoes/${id}/acoes/${acao}`, {
      method: 'POST',
      body: { acao, versao, motivo },
    }),
};

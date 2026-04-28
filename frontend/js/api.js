const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

const SESSION_TOKEN_KEY = 'auth_token';
const SESSION_USER_KEY = 'auth_user';

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const auth = {
  getToken: () => localStorage.getItem(SESSION_TOKEN_KEY),

  getUsuario: () => {
    const userStr = localStorage.getItem(SESSION_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    const user = localStorage.getItem(SESSION_USER_KEY);
    return !!(token && user);
  },

  login: (token, usuario) => {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(usuario));
  },

  logout: () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
  },

  getAuthHeader: () => {
    const token = auth.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const buildUrl = (path, query = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return API_BASE_URL ? url.toString() : `${path}${url.search}`;
};

const request = async (path, options = {}, query = {}) => {
  const authHeaders = auth.getAuthHeader();
  const response = await fetch(buildUrl(path, query), {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  let data = null;

  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(data?.erro || 'Erro na requisicao', response.status, data?.code || data?.codigo);
  }

  return data;
};

const usuariosApi = {
  list: (params) => request('/api/usuarios', { method: 'GET' }, params),
  getById: (id) => request(`/api/usuarios/${id}`, { method: 'GET' }),
  create: (payload) => request('/api/usuarios', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updatePassword: (id, payload) =>
    request(`/api/usuarios/${id}/senha`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/usuarios/${id}`, { method: 'DELETE' }),
};

const authApi = {
  login: (payload) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me', { method: 'GET' }),
};

window.usuariosApi = usuariosApi;
window.authApi = authApi;
window.auth = auth;
window.escapeHtml = escapeHtml;

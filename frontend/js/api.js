const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

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
  const response = await fetch(buildUrl(path, query), {
    headers: {
      'Content-Type': 'application/json',
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

window.usuariosApi = usuariosApi;

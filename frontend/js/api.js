const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro na requisicao');
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

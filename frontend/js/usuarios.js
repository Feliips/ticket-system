if (!window.auth.isAuthenticated()) {
  window.location.href = 'login.html';
  throw new Error('Nao autenticado');
}

const usuariosBody = document.getElementById('usuariosBody');
const feedback = document.getElementById('feedback');
const filtroForm = document.getElementById('filtroForm');
const limparFiltrosBtn = document.getElementById('limparFiltros');
const paginaAnteriorBtn = document.getElementById('paginaAnterior');
const proximaPaginaBtn = document.getElementById('proximaPagina');
const paginationInfo = document.getElementById('paginationInfo');
const filtroNome = document.getElementById('filtroNome');
const filtroLogin = document.getElementById('filtroLogin');
const filtroBuscarBtn = filtroForm.querySelector('button[type="submit"]');
const usuariosTotalPagina = document.getElementById('usuariosTotalPagina');
const usuariosPaginaAtual = document.getElementById('usuariosPaginaAtual');
const usuariosFiltroAtivo = document.getElementById('usuariosFiltroAtivo');

const state = {
  page: 1,
  limit: 8,
  totalPages: 1,
  nome: '',
  login: '',
  totalItemsPagina: 0,
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Sem atualizacao';
  return new Date(dateValue).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const getActiveFilterLabel = () => {
  const activeFilters = [];

  if (state.nome) {
    activeFilters.push(`Nome: ${state.nome}`);
  }

  if (state.login) {
    activeFilters.push(`Login: ${state.login}`);
  }

  return activeFilters.length ? activeFilters.join(' | ') : 'Nenhum';
};

const setFeedback = (message, isError = false) => {
  feedback.textContent = message;
  feedback.classList.toggle('feedback-error', isError);
  feedback.classList.toggle('feedback-success', !isError && Boolean(message));
};

const setLoading = (isLoading) => {
  filtroBuscarBtn.disabled = isLoading;
  limparFiltrosBtn.disabled = isLoading;
  paginaAnteriorBtn.disabled = isLoading || state.page <= 1;
  proximaPaginaBtn.disabled = isLoading || state.page >= state.totalPages;
};

const refreshSummary = () => {
  usuariosTotalPagina.textContent = String(state.totalItemsPagina);
  usuariosPaginaAtual.textContent = String(state.page);
  usuariosFiltroAtivo.textContent = getActiveFilterLabel();
};

const renderEmptyState = (message) => {
  usuariosBody.innerHTML = `
    <tr>
      <td colspan="5" class="usuarios-empty-cell">
        <div class="usuarios-empty-state">
          <strong>Nenhum usuario encontrado</strong>
          <span>${window.escapeHtml(message)}</span>
        </div>
      </td>
    </tr>
  `;
};

const renderRows = (users) => {
  if (!users.length) {
    renderEmptyState('Tente ajustar os filtros ou cadastrar um novo usuario.');
    return;
  }

  usuariosBody.innerHTML = users
    .map((user) => {
      const nome = window.escapeHtml(user.nome || '-');
      const login = window.escapeHtml(user.login || '-');
      const userId = Number(user.usuario_id);

      return `
        <tr>
          <td data-label="ID"><span class="usuarios-id-badge">#${userId}</span></td>
          <td data-label="Usuario">
            <div class="usuarios-user-cell">
              <strong>${nome}</strong>
              <span>Cadastro ativo no Ticket System</span>
            </div>
          </td>
          <td data-label="Login"><code class="usuarios-login-tag">${login}</code></td>
          <td data-label="Atualizacao">${formatDate(user.atualizado_em)}</td>
          <td data-label="Acoes">
            <div class="acoes-cell">
              <a class="btn-secondary" href="usuario-form.html?id=${userId}">Editar</a>
              <button class="btn-danger delete-btn" data-id="${userId}" type="button">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
};

const refreshPagination = () => {
  paginationInfo.textContent = `Pagina ${state.page} de ${state.totalPages}`;
  paginaAnteriorBtn.disabled = state.page <= 1;
  proximaPaginaBtn.disabled = state.page >= state.totalPages;
};

const loadUsers = async () => {
  setLoading(true);
  setFeedback('Carregando usuarios...');

  try {
    const response = await window.usuariosApi.list({
      page: state.page,
      limit: state.limit,
      nome: state.nome,
      login: state.login,
    });

    const items = response.data.items || [];
    const pagination = response.data.pagination || {};

    state.totalItemsPagina = items.length;
    state.totalPages = Math.max(pagination.totalPages || 1, 1);

    renderRows(items);
    refreshSummary();
    refreshPagination();

    if (items.length) {
      setFeedback('Listagem atualizada com sucesso.');
    } else {
      setFeedback('Nenhum registro encontrado para os filtros informados.');
    }
  } catch (error) {
    state.totalItemsPagina = 0;
    refreshSummary();
    setFeedback(error.message || 'Erro ao carregar usuarios.', true);
    renderEmptyState('Nao foi possivel carregar os dados agora.');
  } finally {
    setLoading(false);
  }
};

usuariosBody.addEventListener('click', async (event) => {
  const button = event.target.closest('.delete-btn');
  if (!button) return;

  const id = button.dataset.id;
  const confirmed = window.confirm('Deseja excluir este usuario?');
  if (!confirmed) return;

  try {
    setFeedback('Excluindo usuario...');
    button.disabled = true;
    await window.usuariosApi.remove(id);

    if (state.totalItemsPagina === 1 && state.page > 1) {
      state.page -= 1;
    }

    await loadUsers();
    setFeedback('Usuario excluido com sucesso.');
  } catch (error) {
    button.disabled = false;
    setFeedback(error.message || 'Erro ao excluir usuario.', true);
  }
});

filtroForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.page = 1;
  state.nome = filtroNome.value.trim();
  state.login = filtroLogin.value.trim();
  loadUsers();
});

limparFiltrosBtn.addEventListener('click', () => {
  filtroNome.value = '';
  filtroLogin.value = '';
  state.page = 1;
  state.nome = '';
  state.login = '';
  loadUsers();
});

paginaAnteriorBtn.addEventListener('click', () => {
  if (state.page > 1) {
    state.page -= 1;
    loadUsers();
  }
});

proximaPaginaBtn.addEventListener('click', () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    loadUsers();
  }
});

refreshSummary();
refreshPagination();
loadUsers();

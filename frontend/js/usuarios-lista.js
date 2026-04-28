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

const state = {
  page: 1,
  limit: 10,
  totalPages: 1,
  nome: '',
  login: '',
};

const formatDate = (dateValue) => {
  if (!dateValue) return '-';
  return new Date(dateValue).toLocaleString('pt-BR');
};

const setFeedback = (message, isError = false) => {
  feedback.textContent = message;
  feedback.classList.toggle('feedback-error', isError);
};

const setLoading = (isLoading) => {
  filtroBuscarBtn.disabled = isLoading;
  limparFiltrosBtn.disabled = isLoading;
  paginaAnteriorBtn.disabled = isLoading || state.page <= 1;
  proximaPaginaBtn.disabled = isLoading || state.page >= state.totalPages;
};

const renderRows = (users) => {
  if (!users.length) {
    usuariosBody.innerHTML = '<tr><td colspan="5">Nenhum usuario encontrado.</td></tr>';
    return;
  }

  usuariosBody.innerHTML = users
    .map(
      (user) => `
      <tr>
        <td>${user.usuario_id}</td>
        <td>${user.nome}</td>
        <td>${user.login}</td>
        <td>${formatDate(user.atualizado_em)}</td>
        <td class="acoes-cell">
          <a class="btn-secondary" href="usuario-form.html?id=${user.usuario_id}">Editar</a>
          <button class="btn-outline delete-btn" data-id="${user.usuario_id}" type="button">Excluir</button>
        </td>
      </tr>
    `
    )
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
    state.totalPages = response.data.pagination.totalPages || 1;

    renderRows(items);
    refreshPagination();
    setFeedback(`${items.length} usuario(s) exibido(s) na pagina atual.`);
  } catch (error) {
    setFeedback(error.message || 'Erro ao carregar usuarios.', true);
    usuariosBody.innerHTML = '<tr><td colspan="5">Falha ao carregar dados.</td></tr>';
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
    await window.usuariosApi.remove(id);
    setFeedback('Usuario excluido com sucesso.');
    await loadUsers();
  } catch (error) {
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

loadUsers();

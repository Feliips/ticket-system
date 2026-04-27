const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
const isEditMode = Boolean(userId);

const title = document.getElementById('usuario-form-title');
const usuarioForm = document.getElementById('usuarioForm');
const senhaContainer = document.getElementById('senhaContainer');
const senhaInput = document.getElementById('senha');
const submitBtn = document.getElementById('submitBtn');
const feedbackForm = document.getElementById('feedbackForm');
const senhaForm = document.getElementById('senhaForm');
const novaSenhaInput = document.getElementById('novaSenha');

const setFeedback = (message, isError = false) => {
  feedbackForm.textContent = message;
  feedbackForm.classList.toggle('feedback-error', isError);
};

const fillForm = (user) => {
  document.getElementById('nome').value = user.nome;
  document.getElementById('login').value = user.login;
};

const setupMode = async () => {
  if (!isEditMode) {
    title.textContent = 'Novo usuario';
    submitBtn.textContent = 'Cadastrar usuario';
    senhaForm.classList.add('hidden');
    return;
  }

  title.textContent = 'Editar usuario';
  submitBtn.textContent = 'Salvar alteracoes';
  senhaContainer.classList.add('hidden');
  senhaInput.required = false;
  senhaForm.classList.remove('hidden');

  try {
    const response = await window.usuariosApi.getById(userId);
    fillForm(response.data);
  } catch (error) {
    setFeedback(error.message || 'Erro ao carregar usuario.', true);
  }
};

usuarioForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const login = document.getElementById('login').value.trim();

  try {
    if (isEditMode) {
      await window.usuariosApi.update(userId, { nome, login });
      setFeedback('Usuario atualizado com sucesso.');
      return;
    }

    const senha = senhaInput.value;
    await window.usuariosApi.create({ nome, login, senha });
    window.location.href = 'usuarios.html';
  } catch (error) {
    setFeedback(error.message || 'Erro ao salvar usuario.', true);
  }
});

senhaForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await window.usuariosApi.updatePassword(userId, { novaSenha: novaSenhaInput.value });
    novaSenhaInput.value = '';
    setFeedback('Senha atualizada com sucesso.');
  } catch (error) {
    setFeedback(error.message || 'Erro ao atualizar senha.', true);
  }
});

setupMode();

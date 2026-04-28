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
const senhaSubmitBtn = senhaForm.querySelector('button[type="submit"]');

const setButtonsDisabled = (isDisabled) => {
  submitBtn.disabled = isDisabled;

  if (!senhaForm.classList.contains('hidden')) {
    senhaSubmitBtn.disabled = isDisabled;
  }
};

const setFeedback = (message, isError = false) => {
  feedbackForm.textContent = message;
  feedbackForm.classList.toggle('feedback-error', isError);
};

const getFriendlyMessage = (error) => {
  const rawMessage = String(error?.message || '').toLowerCase();
  const status = Number(error?.status || 0);
  const code = String(error?.code || '').toLowerCase();

  if (
    status === 409 ||
    code === 'er_dup_entry' ||
    code === 'duplicate_entry' ||
    code === 'login_duplicate' ||
    rawMessage.includes('login ja cadastrado')
  ) {
    return 'Esse login ja esta em uso. Tente outro login.';
  }

  if (status === 400 || rawMessage.includes('obrigatorios')) {
    return 'Verifique os campos obrigatorios e tente novamente.';
  }

  if (rawMessage.includes('senha deve ter ao menos 6 caracteres')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (status === 503 || rawMessage.includes('sem conexao com o banco')) {
    return 'Nao foi possivel conectar ao servidor agora. Tente novamente em instantes.';
  }

  return 'Nao foi possivel salvar os dados agora. Tente novamente.';
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
    setFeedback('Carregando dados do usuario...');
    const response = await window.usuariosApi.getById(userId);
    fillForm(response.data);
    setFeedback('Dados carregados.');
  } catch (error) {
    setFeedback(getFriendlyMessage(error), true);
  }
};

usuarioForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const login = document.getElementById('login').value.trim();

  try {
    setButtonsDisabled(true);

    if (isEditMode) {
      setFeedback('Salvando alteracoes...');
      await window.usuariosApi.update(userId, { nome, login });
      setFeedback('Usuario atualizado com sucesso.');
      return;
    }

    const senha = senhaInput.value;
    setFeedback('Cadastrando usuario...');
    await window.usuariosApi.create({ nome, login, senha });
    window.location.href = 'usuarios.html';
  } catch (error) {
    setFeedback(getFriendlyMessage(error), true);
  } finally {
    setButtonsDisabled(false);
  }
});

senhaForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    setButtonsDisabled(true);
    setFeedback('Atualizando senha...');

    await window.usuariosApi.updatePassword(userId, { novaSenha: novaSenhaInput.value });
    novaSenhaInput.value = '';
    setFeedback('Senha atualizada com sucesso.');
  } catch (error) {
    setFeedback(getFriendlyMessage(error), true);
  } finally {
    setButtonsDisabled(false);
  }
});

setupMode();

const cadastroForm = document.getElementById('cadastroForm');
const cadastroSubmitBtn = document.getElementById('cadastroSubmitBtn');
const cadastroFeedback = document.getElementById('cadastroFeedback');

const setCadastroFeedback = (message, isError = false) => {
  cadastroFeedback.textContent = message;
  cadastroFeedback.classList.toggle('feedback-error', isError);
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
    return 'Preencha nome, login e senha para continuar.';
  }

  if (rawMessage.includes('senha deve ter ao menos 6 caracteres')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (status === 503 || rawMessage.includes('sem conexao com o banco')) {
    return 'Nao foi possivel conectar ao servidor agora. Tente novamente em instantes.';
  }

  return 'Nao foi possivel concluir o cadastro agora. Tente novamente.';
};

cadastroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const login = document.getElementById('login').value.trim();
  const senha = document.getElementById('senha').value;

  cadastroSubmitBtn.disabled = true;
  setCadastroFeedback('Cadastrando usuario...');

  try {
    await window.usuariosApi.create({ nome, login, senha });
    setCadastroFeedback('Usuario cadastrado com sucesso. Redirecionando...');
    window.location.href = 'usuarios.html';
  } catch (error) {
    setCadastroFeedback(getFriendlyMessage(error), true);
  } finally {
    cadastroSubmitBtn.disabled = false;
  }
});

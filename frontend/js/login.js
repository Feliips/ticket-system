const loginForm = document.getElementById('loginForm');
const loginInput = document.getElementById('login');
const senhaInput = document.getElementById('senha');
const submitBtn = loginForm.querySelector('button[type="submit"]');

const setFeedback = (message, isError = false) => {
  const existingFeedback = loginForm.querySelector('.feedback-text');
  if (existingFeedback) {
    existingFeedback.textContent = message;
    existingFeedback.classList.toggle('feedback-error', isError);
  } else {
    const feedback = document.createElement('p');
    feedback.className = `feedback-text ${isError ? 'feedback-error' : ''}`;
    feedback.textContent = message;
    feedback.setAttribute('aria-live', 'polite');
    loginForm.appendChild(feedback);
  }
};

const getFriendlyMessage = (error) => {
  const rawMessage = String(error?.message || '').toLowerCase();
  const status = Number(error?.status || 0);

  if (status === 401) {
    return 'Login ou senha invalidos';
  }

  if (status === 400 || rawMessage.includes('obrigatorios')) {
    return 'Preencha login e senha para continuar';
  }

  if (status === 503 || rawMessage.includes('sem conexao')) {
    return 'Nao foi possivel conectar ao servidor. Tente novamente em instantes';
  }

  return 'Nao foi possivel fazer login agora. Tente novamente';
};

if (window.auth.isAuthenticated()) {
  window.location.href = 'index.html';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const login = loginInput.value.trim();
  const senha = senhaInput.value;

  submitBtn.disabled = true;
  setFeedback('Entrando...');

  try {
    const response = await window.authApi.login({ login, senha });

    window.auth.login(response.data.token, response.data.usuario);
    setFeedback('Login realizado com sucesso. Redirecionando...');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (error) {
    setFeedback(getFriendlyMessage(error), true);
  } finally {
    submitBtn.disabled = false;
  }
});
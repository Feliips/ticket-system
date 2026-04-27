const cadastroForm = document.getElementById('cadastroForm');
const cadastroSubmitBtn = document.getElementById('cadastroSubmitBtn');
const cadastroFeedback = document.getElementById('cadastroFeedback');

const setCadastroFeedback = (message, isError = false) => {
  cadastroFeedback.textContent = message;
  cadastroFeedback.classList.toggle('feedback-error', isError);
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
    setCadastroFeedback(error.message || 'Erro ao cadastrar usuario.', true);
  } finally {
    cadastroSubmitBtn.disabled = false;
  }
});

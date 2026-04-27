document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;

  try {
    const data = await window.usuariosApi.create({ nome, login, senha });
    alert(data.mensagem);
    window.location.href = 'usuarios.html';
  } catch (error) {
    alert(error.message || 'Erro ao cadastrar');
  }
});

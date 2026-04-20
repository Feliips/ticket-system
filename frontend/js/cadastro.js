const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, login, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar usuário');
    }

    alert(data.mensagem);
  } catch (error) {
    alert(error.message || 'Erro ao cadastrar');
  }
});

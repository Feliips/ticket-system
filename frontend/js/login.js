document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const senha = document.getElementById("senha").value;

  if (login === "admin" && senha === "admin123") {
    alert("Login realizado com sucesso!");
  } else {
    alert("Usuário ou senha inválidos!");
  }
});
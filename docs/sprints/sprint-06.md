# Sprint 06 - CRUD de Usuarios

## Objetivo

Planejar e implementar o CRUD completo de usuarios, mantendo a arquitetura atual do projeto e sem alterar a estrutura do banco definida em `database/schema.sql`.

---

## Plano Tecnico do CRUD

### 1) Endpoints da API

Base: `/api/usuarios`

- `GET /api/usuarios`
  - Lista usuarios com suporte a paginacao e filtro opcional por `nome` e `login`.
- `GET /api/usuarios/:id`
  - Retorna um usuario por ID.
- `POST /api/usuarios`
  - Cria usuario com `nome`, `login` e `senha`.
- `PUT /api/usuarios/:id`
  - Atualiza `nome` e `login`.
- `PATCH /api/usuarios/:id/senha`
  - Atualiza apenas a senha.
- `DELETE /api/usuarios/:id`
  - Remove usuario por ID.

Padrao de resposta:

- Sucesso: `{ mensagem, data }`
- Erro: `{ erro, detalhes? }`

Status esperados:

- `200`, `201`, `204`, `400`, `404`, `409`, `500`

---

### 2) Estrutura de Arquivos

Backend:

```text
backend/
  controllers/
    usuariosController.js
  services/
    usuariosService.js
  validators/
    usuariosValidator.js
  routes/
    usuarios.js
  middlewares/
    errorHandler.js
```

Frontend:

```text
frontend/
  usuarios.html
  usuario-form.html
  css/
    usuarios.css
  js/
    api.js
    usuarios-lista.js
    usuario-form.js
```

Observacao: `usuarios.css` pode ser incorporado ao `frontend/css/style.css` para manter o padrao visual atual.

---

### 3) Telas Necessarias

- `usuarios.html` (listagem)
  - Tabela com colunas: ID, Nome, Login, Atualizado em
  - Busca por nome/login
  - Acao: Novo usuario
  - Acoes por linha: Editar, Excluir

- `usuario-form.html` (criacao/edicao)
  - Criacao: `nome`, `login`, `senha`
  - Edicao: `nome`, `login`
  - Acao separada para troca de senha

---

### 4) Fluxo Frontend -> Backend -> Banco

Create:

1. Front envia `POST /api/usuarios`.
2. Backend valida entrada, verifica login duplicado e grava no banco.
3. Banco retorna `insertId`; backend responde `201`.

Read:

1. Front chama `GET /api/usuarios` ou `GET /api/usuarios/:id`.
2. Backend consulta banco sem retornar campo `senha`.
3. Backend responde `200` com os dados.

Update:

1. Front envia `PUT /api/usuarios/:id`.
2. Backend valida, verifica conflito de login e atualiza.
3. Backend responde `200` (ou `404` se usuario nao existir).

Update senha:

1. Front envia `PATCH /api/usuarios/:id/senha`.
2. Backend valida senha e atualiza no banco.
3. Backend responde `200`.

Delete:

1. Front envia `DELETE /api/usuarios/:id`.
2. Backend remove registro.
3. Backend responde `204` (ou `404`).

---

### 5) Dependencias Necessarias

Ja existentes:

- `express`
- `mysql2`
- `cors`
- `dotenv`

Adicionar:

- `bcryptjs` (hash de senha)

Opcional:

- `express-validator` (validacao de entrada)
- `nodemon` (produtividade em dev)

---

## Lista de Tarefas por Area

### Backend

1. Criar estrutura em camadas (`controllers`, `services`, `validators`, `middlewares`).
2. Refatorar `routes/usuarios.js` para delegar logica ao controller/service.
3. Implementar endpoints `GET`, `GET/:id`, `PUT`, `PATCH senha` e `DELETE`.
4. Padronizar respostas e codigos HTTP.
5. Aplicar hash de senha na criacao e atualizacao de senha.
6. Garantir que `senha` nao seja retornada em leituras.
7. Implementar paginacao e filtro em `GET /api/usuarios`.
8. Criar checklist de teste manual dos cenarios de sucesso e erro.

### Frontend

1. Criar `usuarios.html` com listagem e acoes de editar/excluir.
2. Criar `usuario-form.html` para novo usuario e edicao.
3. Criar `js/api.js` com funcoes para chamadas HTTP.
4. Implementar `usuarios-lista.js` (carregar, buscar, excluir).
5. Implementar `usuario-form.js` (criar/editar/trocar senha).
6. Exibir feedback de sucesso e erro para cada operacao.
7. Ajustar navegacao entre login, listagem e formulario.
8. Garantir responsividade das novas telas no padrao visual atual.

---

## Criterios de Pronto

- CRUD de usuarios funcionando ponta a ponta.
- API REST com respostas consistentes.
- Frontend integrado aos endpoints de usuarios.
- Senhas nao expostas nas leituras.
- Sprint documentada e validada com testes manuais.

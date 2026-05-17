const request = require("supertest");
const app = require("../backend/server");

const createdUserIds = new Set();

const createUniqueUserPayload = (prefix = "testuser") => {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

  return {
    nome: `Usuario ${prefix} ${suffix}`,
    login: `${prefix}_${suffix}`,
    senha: "Teste123!"
  };
};

const registerUser = async (payload) => {
  const response = await request(app)
    .post("/api/usuarios")
    .send(payload)
    .expect(201);

  const userId = response.body?.data?.usuario_id;
  if (Number.isInteger(userId)) {
    createdUserIds.add(userId);
  }

  return response;
};

const loginUser = async (payload) => {
  return request(app)
    .post("/api/auth/login")
    .send({
      login: payload.login,
      senha: payload.senha
    });
};

describe("FULL SYSTEM TEST", () => {
  let authToken;
  let testUserId;
  let testUserPayload;

  afterAll(async () => {
    if (authToken) {
      for (const userId of createdUserIds) {
        await request(app)
          .delete(`/api/usuarios/${userId}`)
          .set("Authorization", `Bearer ${authToken}`);
      }
    }
  });

  describe("TEST 1 - DISPONIBILIDADE", () => {
    test("Acessar URL principal", async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.text).toContain("<html");
    });
  });

  describe("TEST 2 - NAVEGACAO", () => {
    test("Verificar link para login existe", async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(
        res.text.includes("login.html") || res.text.includes("Entrar")
      ).toBe(true);
    });
  });

  describe("TEST 3 - CADASTRO", () => {
    test("Cenario 1 - Sucesso", async () => {
      testUserPayload = createUniqueUserPayload();

      const res = await registerUser(testUserPayload);

      testUserId = res.body.data.usuario_id;

      expect(res.body).toEqual(
        expect.objectContaining({
          mensagem: "Usuario cadastrado com sucesso",
          data: expect.objectContaining({
            usuario_id: expect.any(Number),
            nome: testUserPayload.nome,
            login: testUserPayload.login
          })
        })
      );
      expect(res.body.data.senha).toBeUndefined();
    });

    test("Cenario 2 - Login duplicado", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send(testUserPayload);

      expect(res.status).toBe(409);
      expect(res.body).toEqual(
        expect.objectContaining({
          erro: "Login ja cadastrado"
        })
      );
    });
  });

  describe("TEST 4 - LOGIN", () => {
    test("Cenario 1 - Sucesso", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          login: testUserPayload.login,
          senha: testUserPayload.senha
        });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toEqual(expect.any(String));
      expect(res.body.data.token.split(".")).toHaveLength(3);
      expect(res.body.data.usuario).toEqual(
        expect.objectContaining({
          usuario_id: testUserId,
          nome: testUserPayload.nome,
          login: testUserPayload.login
        })
      );
      expect(res.body.data.usuario.senha).toBeUndefined();

      authToken = res.body.data.token;
    });

    test("Cenario 2 - Erro (senha errada)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          login: testUserPayload.login,
          senha: "SenhaErrada123!"
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ erro: "Login ou senha invalidos" });
    });
  });

  describe("TEST 5 - AUTENTICACAO JWT", () => {
    test("Acessar rota protegida SEM token", async () => {
      const res = await request(app).get("/api/usuarios");

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ erro: "Token ausente" });
    });

    test("Acessar rota COM token valido", async () => {
      const res = await request(app)
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          mensagem: "Usuarios listados com sucesso",
          data: expect.objectContaining({
            items: expect.any(Array),
            pagination: expect.objectContaining({
              page: expect.any(Number),
              limit: expect.any(Number),
              total: expect.any(Number),
              totalPages: expect.any(Number)
            })
          })
        })
      );
    });
  });

  describe("TEST 6 - CRUD USUARIOS", () => {
    test("Listagem de usuarios", async () => {
      const res = await request(app)
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.items)).toBe(true);
      expect(
        res.body.data.items.some((user) => user.usuario_id === testUserId)
      ).toBe(true);
    });

    test("Atualizacao de usuario", async () => {
      const updatedLogin = `atualizado_${Date.now()}`;
      const res = await request(app)
        .put(`/api/usuarios/${testUserId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          nome: "Nome Atualizado",
          login: updatedLogin
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          mensagem: "Usuario atualizado com sucesso",
          data: expect.objectContaining({
            usuario_id: testUserId,
            nome: "Nome Atualizado",
            login: updatedLogin
          })
        })
      );

      testUserPayload = {
        ...testUserPayload,
        nome: "Nome Atualizado",
        login: updatedLogin
      };
    });

    test("Exclusao de usuario", async () => {
      const tempUserPayload = createUniqueUserPayload("delete");
      const createRes = await registerUser(tempUserPayload);
      const tempUserId = createRes.body.data.usuario_id;

      const deleteRes = await request(app)
        .delete(`/api/usuarios/${tempUserId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(204);
      createdUserIds.delete(tempUserId);
    });
  });

  describe("TEST 7 - INTEGRACAO", () => {
    test("Fluxo completo: criar, listar, atualizar, excluir", async () => {
      const flowUserPayload = createUniqueUserPayload("flowtest");
      const createRes = await registerUser(flowUserPayload);
      const flowUserId = createRes.body.data.usuario_id;

      const listRes = await request(app)
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${authToken}`);

      expect(listRes.status).toBe(200);
      expect(
        listRes.body.data.items.some((user) => user.usuario_id === flowUserId)
      ).toBe(true);

      const updatedFlowLogin = `flow_atualizado_${Date.now()}`;
      const updateRes = await request(app)
        .put(`/api/usuarios/${flowUserId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          nome: "Atualizado via Fluxo",
          login: updatedFlowLogin
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data).toEqual(
        expect.objectContaining({
          usuario_id: flowUserId,
          nome: "Atualizado via Fluxo",
          login: updatedFlowLogin
        })
      );

      const deleteRes = await request(app)
        .delete(`/api/usuarios/${flowUserId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(204);
      createdUserIds.delete(flowUserId);
    });
  });

  describe("TEST 8 - ERROS", () => {
    test("Campos vazios no cadastro", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send({ login: "", senha: "", nome: "", email: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          erro: expect.any(String)
        })
      );
    });

    test("Dados invalidos no login", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ login: "", senha: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          erro: expect.any(String)
        })
      );
    });
  });

  describe("TEST 9 - DEPLOY LOCAL", () => {
    test("API responde localmente", async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
    });
  });

  describe("TEST 10 - SEGURANCA", () => {
    test("Senha nao exposta na resposta", async () => {
      const payload = createUniqueUserPayload("sectest");
      const res = await registerUser(payload);
      const createdUser = res.body.data;

      expect(JSON.stringify(createdUser).includes("senha")).toBe(false);
      expect(createdUser.senha).toBeUndefined();
    });

    test("JWT utilizado corretamente", () => {
      expect(authToken).toEqual(expect.any(String));
      expect(authToken.split(".")).toHaveLength(3);
    });
  });
});

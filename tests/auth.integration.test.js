process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.mock("../backend/db", () => ({
  execute: jest.fn(),
  query: jest.fn()
}));

const bcrypt = require("bcryptjs");
const request = require("supertest");
const db = require("../backend/db");
const app = require("../backend/server");
const { signToken } = require("../backend/utils/jwt");

describe("Autenticacao JWT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("cadastro salva senha com hash bcrypt", async () => {
    db.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 11 }])
      .mockResolvedValueOnce([
        [
          {
            usuario_id: 11,
            nome: "Usuario Teste",
            login: "usuario.teste",
            atualizado_em: null,
            atualizado_por: null
          }
        ]
      ]);

    const response = await request(app)
      .post("/api/usuarios")
      .send({
        nome: "Usuario Teste",
        login: "usuario.teste",
        senha: "senha123"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.senha).toBeUndefined();

    const insertCall = db.execute.mock.calls[1];
    const hashedPassword = insertCall[1][2];

    expect(hashedPassword).not.toBe("senha123");
    expect(await bcrypt.compare("senha123", hashedPassword)).toBe(true);
  });

  test("login retorna token JWT e nao expoe senha", async () => {
    const senhaHash = await bcrypt.hash("senha123", 10);

    db.execute.mockResolvedValueOnce([
      [
        {
          usuario_id: 5,
          nome: "Maria Silva",
          login: "maria.silva",
          senha: senhaHash,
          atualizado_em: null,
          atualizado_por: null
        }
      ]
    ]);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ login: "maria.silva", senha: "senha123" });

    expect(response.status).toBe(200);
    expect(response.body.mensagem).toBe("Login realizado com sucesso");
    expect(response.body.data.token).toEqual(expect.any(String));
    expect(response.body.data.token.split(".")).toHaveLength(3);
    expect(response.body.data.usuario).toEqual(
      expect.objectContaining({
        usuario_id: 5,
        nome: "Maria Silva",
        login: "maria.silva"
      })
    );
    expect(response.body.data.usuario.senha).toBeUndefined();
  });

  test("login com senha invalida retorna 401", async () => {
    const senhaHash = await bcrypt.hash("senha123", 10);

    db.execute.mockResolvedValueOnce([
      [
        {
          usuario_id: 5,
          nome: "Maria Silva",
          login: "maria.silva",
          senha: senhaHash,
          atualizado_em: null,
          atualizado_por: null
        }
      ]
    ]);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ login: "maria.silva", senha: "senha-invalida" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ erro: "Login ou senha invalidos" });
  });

  test("rota protegida sem token retorna 401", async () => {
    const response = await request(app)
      .get("/api/usuarios")
      .expect(401);

    expect(response.body).toEqual({ erro: "Token ausente" });
  });

  test("rota protegida com token valido retorna 200", async () => {
    db.execute
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([
        [
          {
            usuario_id: 1,
            nome: "Admin",
            login: "admin",
            atualizado_em: null,
            atualizado_por: null
          }
        ]
      ]);

    const token = signToken({ sub: "1", usuario_id: 1, login: "admin" });

    const response = await request(app)
      .get("/api/usuarios")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        mensagem: "Usuarios listados com sucesso",
        data: expect.objectContaining({
          items: expect.any(Array),
          pagination: expect.any(Object)
        })
      })
    );
  });
});

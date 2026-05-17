process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

jest.mock('../backend/db', () => ({
  execute: jest.fn(),
  query: jest.fn(),
}));

const request = require('supertest');
const db = require('../backend/db');
const app = require('../backend/server');
const { signToken } = require('../backend/utils/jwt');

const authHeader = () => ({
  Authorization: `Bearer ${signToken({ sub: '1', usuario_id: 1, login: 'admin' })}`,
});

describe('API de usuarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cria usuario com dados validos', async () => {
    db.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 7 }])
      .mockResolvedValueOnce([
        [
          {
            usuario_id: 7,
            nome: 'Maria Silva',
            login: 'maria.silva',
            atualizado_em: '2026-05-17T12:00:00.000Z',
            atualizado_por: null,
          },
        ],
      ]);

    const response = await request(app).post('/api/usuarios').send({
      nome: 'Maria Silva',
      login: 'maria.silva',
      senha: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      mensagem: 'Usuario cadastrado com sucesso',
      data: expect.objectContaining({
        usuario_id: 7,
        nome: 'Maria Silva',
        login: 'maria.silva',
      }),
    });
  });

  it('valida campos obrigatorios no cadastro', async () => {
    const response = await request(app).post('/api/usuarios').send({
      nome: '',
      login: '',
      senha: '',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ erro: 'nome, login e senha sao obrigatorios' });
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('retorna conflito para login duplicado no cadastro', async () => {
    db.execute.mockResolvedValueOnce([
      [
        {
          usuario_id: 3,
          nome: 'Maria Silva',
          login: 'maria.silva',
        },
      ],
    ]);

    const response = await request(app).post('/api/usuarios').send({
      nome: 'Maria Silva',
      login: 'maria.silva',
      senha: '123456',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      erro: 'Login ja cadastrado',
      code: 'LOGIN_DUPLICATE',
    });
  });

  it('lista usuarios autenticado', async () => {
    db.execute
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([
        [
          {
            usuario_id: 2,
            nome: 'Joao Lima',
            login: 'joao.lima',
            atualizado_em: '2026-05-17T12:00:00.000Z',
            atualizado_por: null,
          },
        ],
      ]);

    const response = await request(app)
      .get('/api/usuarios?page=1&limit=10')
      .set(authHeader());

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      mensagem: 'Usuarios listados com sucesso',
      data: {
        items: [
          expect.objectContaining({
            usuario_id: 2,
            nome: 'Joao Lima',
            login: 'joao.lima',
          }),
        ],
        pagination: expect.objectContaining({
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        }),
      },
    });
  });

  it('atualiza usuario autenticado', async () => {
    db.execute
      .mockResolvedValueOnce([
        [
          {
            usuario_id: 5,
            nome: 'Ana Souza',
            login: 'ana.souza',
          },
        ],
      ])
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([
        [
          {
            usuario_id: 5,
            nome: 'Ana Clara Souza',
            login: 'ana.clara',
            atualizado_em: '2026-05-17T12:00:00.000Z',
            atualizado_por: null,
          },
        ],
      ]);

    const response = await request(app)
      .put('/api/usuarios/5')
      .set(authHeader())
      .send({
        nome: 'Ana Clara Souza',
        login: 'ana.clara',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      mensagem: 'Usuario atualizado com sucesso',
      data: expect.objectContaining({
        usuario_id: 5,
        nome: 'Ana Clara Souza',
        login: 'ana.clara',
      }),
    });
  });

  it('remove usuario autenticado', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const response = await request(app)
      .delete('/api/usuarios/8')
      .set(authHeader());

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });
});

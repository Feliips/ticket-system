-- =====================================
-- Sistema de Venda de Ingressos
-- Sprint 3 - Estrutura do Banco
-- =====================================

-- ==============================
-- TABELA USUARIOS
-- ==============================

CREATE TABLE tbUsuarios (

    usuario_id INT AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INT,

    PRIMARY KEY (usuario_id)

);

-- ==============================
-- TABELA PESSOAS
-- ==============================

CREATE TABLE tbPessoas (

    pessoa_id INT AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nascimento DATE NOT NULL,
    telefone VARCHAR(20),
    pessoa_tipo_id INT,
    atualizado_por INT,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (pessoa_id)

);

-- ==============================
-- TABELA TIPO DE EVENTO
-- ==============================

CREATE TABLE tbEventoTipo (

    evento_tipo_id INT AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL UNIQUE,

    PRIMARY KEY (evento_tipo_id)

);

-- ==============================
-- TABELA TIPO DE TITULO (INGRESSO)
-- ==============================

CREATE TABLE tbTipoTitulo (

    tipo_titulo_id INT AUTO_INCREMENT,
    descricao VARCHAR(100) NOT NULL UNIQUE,

    PRIMARY KEY (tipo_titulo_id)

);

-- ==============================
-- TABELA EVENTO
-- ==============================

CREATE TABLE tbEvento (

    evento_id INT AUTO_INCREMENT,
    evento_tipo_id INT NOT NULL,
    pessoa_id INT NOT NULL,
    forma_pagamento_id INT NOT NULL,
    data DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    atualizado_por INT,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (evento_id),

    CONSTRAINT fk_evento_tipo
    FOREIGN KEY (evento_tipo_id)
    REFERENCES tbEventoTipo(evento_tipo_id),

    CONSTRAINT fk_evento_pessoa
    FOREIGN KEY (pessoa_id)
    REFERENCES tbPessoas(pessoa_id),

    CONSTRAINT fk_evento_pagamento
    FOREIGN KEY (forma_pagamento_id)
    REFERENCES tbTipoTitulo(tipo_titulo_id)

);
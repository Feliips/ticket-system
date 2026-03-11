# 🎟️ Sistema de Gerenciamento e Venda de Ingressos

Projeto acadêmico desenvolvido para a disciplina **Desenvolvimento de Aplicações Corporativas (ADS5N1)** do **Centro Universitário Fametro – UNIFAMETRO Fortaleza**.

O objetivo do projeto é desenvolver um **sistema web para gerenciamento e venda de ingressos para eventos**, permitindo o controle de usuários, eventos, tipos de eventos, pessoas cadastradas e informações financeiras relacionadas aos ingressos.

O sistema será desenvolvido de forma **incremental utilizando metodologia de Sprints**, onde cada etapa do desenvolvimento será entregue semanalmente conforme o cronograma definido na disciplina.

---

# 📚 Informações Acadêmicas

**Disciplina:** Desenvolvimento de Aplicações Corporativas
**Curso:** Análise e Desenvolvimento de Sistemas (ADS)
**Instituição:** Centro Universitário Fametro – UNIFAMETRO Fortaleza
**Semestre:** 5º Semestre

---

# 🎯 Objetivo do Sistema

O sistema tem como objetivo fornecer uma plataforma para **gerenciamento de eventos e venda de ingressos**, permitindo:

* Cadastro de usuários do sistema
* Cadastro de pessoas
* Cadastro e gerenciamento de eventos
* Classificação de eventos por tipo
* Controle de informações financeiras relacionadas aos ingressos
* Listagem de dados e relatórios

Este projeto simula o funcionamento de sistemas corporativos utilizados por empresas que realizam eventos e comercializam ingressos.

---

# 🧱 Arquitetura do Projeto

O sistema segue uma arquitetura web dividida em três camadas principais:

Frontend → Interface do usuário
Backend → Lógica da aplicação
Banco de Dados → Armazenamento das informações

Estrutura geral:

Usuário → Interface Web → Servidor da Aplicação → Banco de Dados

---

# 💻 Tecnologias Utilizadas

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js

## Banco de Dados

* MySQL

## Controle de Versão

* Git
* GitHub

## Hospedagem

* Render (deploy da aplicação)

---

# ☁️ Hospedagem do Projeto

A aplicação será hospedada na plataforma:

Render

Essa plataforma permite executar aplicações Node.js na nuvem de forma gratuita, sendo adequada para projetos acadêmicos e protótipos de sistemas web.

---

# 🗂️ Estrutura de Pastas do Projeto

```
ticket-system/
│
├── docs/
│   ├── diagrams/
│   └── sprints/
│
├── frontend/
│   ├── css/
│   ├── assets/
│   └── index.html
│
├── backend/
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── package.json
└── README.md
```

---

# 🗄️ Estrutura do Banco de Dados

O banco de dados foi definido através de um **diagrama relacional fornecido pelo professor**, e deve ser implementado sem alterações.

Tabelas principais do sistema:

* tbUsuarios
* tbPessoas
* tbEvento
* tbEventoTipo
* tbTipoTitulo

O diagrama completo encontra-se na pasta:

docs/diagrams

---

# 🏃 Metodologia de Desenvolvimento

O projeto será desenvolvido utilizando **metodologia incremental baseada em Sprints semanais**, onde cada etapa adiciona novas funcionalidades ao sistema.

---

# 📅 Cronograma de Sprints

| Data   | Sprint   | Atividade                     |
| ------ | -------- | ----------------------------- |
| 09/Mar | Sprint 1 | Hospedagem e página inicial   |
| 16/Mar | Sprint 2 | Criação do banco de dados     |
| 23/Mar | Sprint 3 | Estrutura do banco            |
| 30/Mar | Sprint 4 | Frontend – Tela de Login      |
| 06/Abr | Sprint 5 | Backend – Cadastro de Usuário |
| 27/Abr | Sprint 6 | CRUD de Usuários              |
| 04/Mai | Sprint 7 | CRUD de Cadastro              |
| 11/Mai | Sprint 8 | CRUD adicional                |
| 01/Jun | Sprint 9 | Geração de listagem em PDF    |

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos na disciplina de Desenvolvimento de Aplicações Corporativas.

Uso educacional permitido.

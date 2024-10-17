# Gerenciador de Tarefas

Este é um aplicativo de gerenciamento de tarefas construído com React no frontend e Node.js no backend. O projeto inclui funcionalidades para adicionar, editar, excluir e filtrar tarefas com base em diferentes critérios, como data e prioridade.

## Índice
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Criação do Banco de Dados](#criação-do-banco-de-dados)
- [Instalação de Dependências](#instalação-de-dependências)
- [Configuração do Backend](#configuração-do-backend)
- [Configuração do Frontend](#configuração-do-frontend)
- [Execução do Projeto](#execução-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Pré-requisitos
Certifique-se de ter instalado em seu sistema:
- Node.js (versão 14.x ou superior)
- npm (versão 6.x ou superior)
- PostgreSQL (versão 12.x ou superior)

## Configuração do Ambiente
### Clone o Repositório
```bash
git clone https://github.com/pereira13/Projeto_To-do_list.git
cd gerenciador-de-tarefas


Instale as Dependências
Backend
bash
Copiar código
cd backend
npm install
Frontend
bash
Copiar código
cd ../frontend
npm install
Criação do Banco de Dados
Crie o Banco de Dados
No PostgreSQL, crie um banco de dados chamado gerenciador_tarefas:

sql
Copiar código
CREATE DATABASE gerenciador_tarefas;
Crie as Tabelas
Tabela de Usuários
sql
Copiar código
CREATE TABLE usuarios (
  usuario_id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  celular VARCHAR(20)
);
Tabela de Tarefas
sql
Copiar código
CREATE TABLE tarefas (
  tarefa_id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_vencimento DATE,
  prioridade VARCHAR(10),
  status_conclusao BOOLEAN DEFAULT FALSE,
  usuario_id INT REFERENCES usuarios(usuario_id)
);
Configuração do Backend
Configure as Variáveis de Ambiente
Crie um arquivo .env na pasta backend e adicione suas credenciais do PostgreSQL:

plaintext
Copiar código
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=gerenciador_tarefas
JWT_SECRET=secreta_chave_jwt
Inicie o Servidor Backend
bash
Copiar código
cd backend
npm start
Configuração do Frontend
Inicie o Servidor Frontend
bash
Copiar código
cd frontend
npm start
Execução do Projeto
Acesse o Aplicativo
Abra seu navegador e acesse http://localhost:3000.

Funcionalidades
Cadastro de Usuário: Cadastre-se com um nome, email, senha e celular.
Login: Faça login usando seu email e senha para acessar o aplicativo.
Gerenciamento de Tarefas: Adicione, edite, delete e visualize tarefas.
Filtros: Filtre tarefas por status (concluídas, não concluídas), data e prioridade.
Responsividade: Interface amigável em dispositivos móveis e desktop.
Modo Escuro/Claro: Altere entre modos claro e escuro conforme sua preferência.
Tecnologias Utilizadas
Frontend
React
Axios
CSS
Backend
Node.js
Express
PostgreSQL
bcryptjs
jsonwebtoken
Database
PostgreSQL
Estrutura do Projeto
css
Copiar código
gerenciador-de-tarefas/
├── backend/
│   ├── db.js
│   ├── index.js
│   ├── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Tarefas.js
│   │   │   ├── ...
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── ...
├── .gitignore
├── README.md
Contribuição
Faça um fork do projeto.
Crie uma branch para sua feature (git checkout -b feature/AmazingFeature).
Commit suas mudanças (git commit -m 'Add some AmazingFeature').
Dê um push para a branch (git push origin feature/AmazingFeature).
Abra um Pull Request.
Licença
Distribuído sob a Licença MIT. Veja LICENSE para mais informações.

markdown
Copiar código

### Resumo
- Cada seção foi formatada com títulos, listas e blocos de código para facilitar a leitura e compreensão.
- Links foram incluídos onde apropriado, e a estrutura do projeto foi apresentada de forma clara.
- Certifique-se de ajustar o link do repositório para o correto antes de usar este `README.md`.

Se precisar de mais ajuda ou ajustes, sinta-se à vontade para perguntar!

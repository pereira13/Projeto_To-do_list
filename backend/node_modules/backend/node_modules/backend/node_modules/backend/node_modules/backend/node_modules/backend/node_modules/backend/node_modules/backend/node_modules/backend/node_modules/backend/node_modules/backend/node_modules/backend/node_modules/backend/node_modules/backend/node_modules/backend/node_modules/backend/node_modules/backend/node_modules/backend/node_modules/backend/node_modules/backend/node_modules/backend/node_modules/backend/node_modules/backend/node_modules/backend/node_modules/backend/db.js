const { Pool } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',       // Usuário do PostgreSQL
  host: 'localhost',      // Host do banco de dados
  database: 'to_list_db', // Nome do banco de dados
  password: 'pereira13',  // Senha do banco de dados
  port: 5432,             // Porta padrão do PostgreSQL
});

// Exporta a pool de conexão para ser usada em outros arquivos
module.exports = pool;

const { Pool } = require('pg'); // Importa a classe Pool do módulo pg para gerenciar conexões com o banco de dados PostgreSQL
// Cria uma nova instância de Pool com as configurações do banco de dados
const pool = new Pool({
  user: 'postgres', // Nome de usuário do banco de dados
  host: 'localhost', // Host onde o banco de dados está sendo executado
  database: 'to_list_db', // Nome do banco de dados a ser utilizado
  password: 'pereira13', // Senha do usuário do banco de dados
  port: 5432, // Porta padrão do PostgreSQL
});
// Exporta a instância do pool para que possa ser utilizada em outros módulos
module.exports = pool;
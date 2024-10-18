const { Client } = require('pg');

// Configurações do cliente PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'pereira13',
  port: 5432,
});

async function createDatabase() {
  try {
    // Conectando ao PostgreSQL
    await client.connect();
    
    // Nome do banco de dados
    const dbName = 'to_list_db';
    
    // Comando para criar o banco de dados
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Banco de dados ${dbName} criado com sucesso!`);

    // Reconfigurando o cliente para se conectar ao novo banco de dados
    const dbClient = new Client({
      user: 'postgres',
      host: 'localhost',
      database: dbName,
      password: 'pereira13',
      port: 5432,
    });

    await dbClient.connect();

    // Comando para criar a tabela `usuarios`
    await dbClient.query(`
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        senha VARCHAR(100),
        celular VARCHAR(15)
      );
    `);

    console.log('Tabela `usuarios` criada com sucesso!');

    // Comando para criar a tabela `tarefas`
    await dbClient.query(`
      CREATE TABLE tarefas (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100),
        descricao TEXT,
        data_vencimento DATE,
        prioridade VARCHAR(10),
        status_conclusao BOOLEAN,
        usuario_id INTEGER,
        CONSTRAINT fk_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
      );
    `);

    console.log('Tabela `tarefas` criada com sucesso!');

    // Fechando a conexão com o novo banco de dados
    await dbClient.end();

  } catch (err) {
    console.error('Erro ao criar o banco de dados ou tabelas:', err);
  } finally {
    // Fechando a conexão com o PostgreSQL
    await client.end();
  }
}

createDatabase();

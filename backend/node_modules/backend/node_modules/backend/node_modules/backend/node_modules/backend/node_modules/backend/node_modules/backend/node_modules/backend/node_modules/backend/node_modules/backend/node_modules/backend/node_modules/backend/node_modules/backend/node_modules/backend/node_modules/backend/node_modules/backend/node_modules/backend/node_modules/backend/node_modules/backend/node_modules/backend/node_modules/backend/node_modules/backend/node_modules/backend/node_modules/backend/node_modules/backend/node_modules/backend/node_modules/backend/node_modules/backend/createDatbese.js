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
    } catch (err) {
        console.error('Erro ao criar o banco de dados:', err);
    } finally {
        // Fechando a conexão
        await client.end();
    }
}

createDatabase();

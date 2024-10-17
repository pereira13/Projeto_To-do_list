const express = require('express'); // Importa o módulo Express para criar o servidor
const cors = require('cors'); // Importa o middleware CORS para permitir requisições de diferentes origens
const pool = require('./db'); // Importa o pool de conexões do banco de dados PostgreSQL
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para criar e verificar tokens JWT
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para hash e verificação de senhas
const app = express(); // Cria uma instância do aplicativo Express

// Middleware
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Middleware para parsear requisições JSON

// Função para gerar tokens JWT
const generateToken = (id) => {
  return jwt.sign({ id }, 'secreta_chave_jwt', { expiresIn: '1h' }); // Gera um token JWT com ID do usuário e validade de 1 hora
};

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extrai o token do cabeçalho da requisição
  if (!token) return res.status(401).json({ error: 'Acesso negado' }); // Retorna erro se não houver token

  try {
    const verified = jwt.verify(token, 'secreta_chave_jwt'); // Verifica o token usando a chave secreta
    req.user = verified; // Armazena as informações do usuário na requisição
    next(); // Chama o próximo middleware ou rota
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' }); // Retorna erro se o token for inválido
  }
};

// Rotas de Registro e Login

// Rota de Registro
app.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, celular } = req.body; // Extrai dados do corpo da requisição
    const hashedPassword = await bcrypt.hash(senha, 10); // Faz o hash da senha
    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, celular) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, hashedPassword, celular] // Insere o novo usuário no banco de dados
    );
    res.json(newUser.rows[0]); // Retorna o novo usuário registrado
  } catch (err) {
    console.error(err.message); // Log de erro
  }
});

// Rota de Login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body; // Extrai dados do corpo da requisição
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]); // Busca o usuário no banco de dados

    if (user.rows.length > 0) { // Verifica se o usuário foi encontrado
      const validPassword = await bcrypt.compare(senha, user.rows[0].senha); // Compara a senha fornecida com a hash armazenada
      if (!validPassword) {
        return res.status(401).json({ error: 'Senha incorreta' }); // Retorna erro se a senha estiver incorreta
      }

      const token = generateToken(user.rows[0].usuario_id); // Gera um token JWT para o usuário
      res.json({ token, user: user.rows[0] }); // Retorna o token e os dados do usuário
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' }); // Retorna erro se o usuário não for encontrado
    }
  } catch (err) {
    console.error(err.message); // Log de erro
  }
});

// Rotas de Tarefas

// Rota para criação de tarefas com prioridade
app.post('/tarefas', authenticateToken, async (req, res) => {
  try {
    const { titulo, descricao, data_vencimento, prioridade } = req.body; // Extrai dados do corpo da requisição
    console.log('Request Body:', req.body); // Log do corpo da requisição para depuração
    const newTarefa = await pool.query(
      'INSERT INTO tarefas (titulo, descricao, data_vencimento, prioridade, status_conclusao, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descricao, data_vencimento, prioridade, false, req.user.id] // Insere a nova tarefa no banco de dados
    );
    console.log('New Task:', newTarefa.rows[0]); // Log da nova tarefa criada
    res.json(newTarefa.rows[0]); // Retorna a nova tarefa
  } catch (err) {
    console.error(err.message); // Log de erro
    res.status(500).send('Erro ao adicionar tarefa'); // Retorna erro ao adicionar a tarefa
  }
});

// Rota para atualização de tarefas com prioridade
app.put('/tarefas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Extrai o ID da tarefa da URL
    const { titulo, descricao, data_vencimento, prioridade, status_conclusao } = req.body; // Extrai dados do corpo da requisição
    console.log('Update Request Body:', req.body); // Log do corpo da requisição para depuração
    await pool.query(
      'UPDATE tarefas SET titulo = $1, descricao = $2, data_vencimento = $3, prioridade = $4, status_conclusao = $5 WHERE tarefa_id = $6 AND usuario_id = $7',
      [titulo, descricao, data_vencimento, prioridade, status_conclusao, id, req.user.id] // Atualiza a tarefa no banco de dados
    );
    console.log('Task Updated'); // Log para verificar a atualização da tarefa
    res.json('Tarefa atualizada!'); // Retorna confirmação de atualização
  } catch (err) {
    console.error(err.message); // Log de erro
    res.status(500).send('Erro ao atualizar tarefa'); // Retorna erro ao atualizar a tarefa
  }
});

// Rota para obter todas as tarefas do usuário autenticado
app.get('/tarefas', authenticateToken, async (req, res) => {
  try {
    const allTarefas = await pool.query('SELECT * FROM tarefas WHERE usuario_id = $1', [req.user.id]); // Busca todas as tarefas do usuário
    res.json(allTarefas.rows); // Retorna a lista de tarefas
  } catch (err) {
    console.error(err.message); // Log de erro
    res.status(500).send('Erro ao obter tarefas'); // Retorna erro ao obter tarefas
  }
});

// Rota para deletar uma tarefa pelo ID
app.delete('/tarefas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Extrai o ID da tarefa da URL
    await pool.query('DELETE FROM tarefas WHERE tarefa_id = $1 AND usuario_id = $2', [id, req.user.id]); // Remove a tarefa do banco de dados
    res.json('Tarefa deletada!'); // Retorna confirmação de deleção
  } catch (err) {
    console.error(err.message); // Log de erro
    res.status(500).send('Erro ao deletar tarefa'); // Retorna erro ao deletar a tarefa
  }
});

// Inicialização do Servidor
app.listen(5000, () => {
  console.log('Servidor iniciado na porta 5000'); // Log para indicar que o servidor está em execução
});

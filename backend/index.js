const express = require('express');
const cors = require('cors');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware para permitir solicitações de outras origens (CORS) e para parsear JSON
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// Função para gerar um token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, 'secreta_chave_jwt', { expiresIn: '1h' }); // Token expira em 1 hora
};

// Middleware de autenticação via JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Obtém o token do cabeçalho Authorization
  if (!token) return res.status(401).json({ error: 'Acesso negado' }); // Retorna erro se não houver token

  try {
    const verified = jwt.verify(token, 'secreta_chave_jwt'); // Verifica o token JWT
    req.user = verified; // Associa o usuário verificado à requisição
    next(); // Continua para a próxima função
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' }); // Retorna erro se o token for inválido
  }
};

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, celular } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10); // Gera um hash da senha
    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, celular) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, hashedPassword, celular]
    );
    res.json(newUser.rows[0]); // Retorna o novo usuário
  } catch (err) {
    console.error(err.message);
  }
});

// Rota para fazer login de um usuário existente
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(senha, user.rows[0].senha); // Compara a senha
      if (!validPassword) {
        return res.status(401).json({ error: 'Senha incorreta' }); // Senha inválida
      }

      const token = generateToken(user.rows[0].usuario_id); // Gera o token JWT
      res.json({ token, user: user.rows[0] }); // Retorna o token e os dados do usuário
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' }); // Usuário não encontrado
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Rota para criar uma nova tarefa
app.post('/tarefas', authenticateToken, async (req, res) => {
  try {
    const { titulo, descricao, data_vencimento, prioridade } = req.body;
    const newTarefa = await pool.query(
      'INSERT INTO tarefas (titulo, descricao, data_vencimento, prioridade, status_conclusao, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descricao, data_vencimento, prioridade, false, req.user.id]
    );
    res.json(newTarefa.rows[0]); // Retorna a nova tarefa criada
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao adicionar tarefa');
  }
});

// Rota para atualizar uma tarefa existente
app.put('/tarefas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, data_vencimento, prioridade, status_conclusao } = req.body;
    await pool.query(
      'UPDATE tarefas SET titulo = $1, descricao = $2, data_vencimento = $3, prioridade = $4, status_conclusao = $5 WHERE tarefa_id = $6 AND usuario_id = $7',
      [titulo, descricao, data_vencimento, prioridade, status_conclusao, id, req.user.id]
    );
    res.json('Tarefa atualizada!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao atualizar tarefa');
  }
});

// Rota para obter todas as tarefas do usuário autenticado
app.get('/tarefas', authenticateToken, async (req, res) => {
  try {
    const allTarefas = await pool.query('SELECT * FROM tarefas WHERE usuario_id = $1', [req.user.id]);
    res.json(allTarefas.rows); // Retorna todas as tarefas do usuário
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao obter tarefas');
  }
});

// Rota para deletar uma tarefa
app.delete('/tarefas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tarefas WHERE tarefa_id = $1 AND usuario_id = $2', [id, req.user.id]);
    res.json('Tarefa deletada!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao deletar tarefa');
  }
});

// Inicialização do servidor na porta 5000
app.listen(5000, () => {
  console.log('Servidor iniciado na porta 5000');
});

const express = require('express'); // Importa o módulo Express para criar o servidor
const cors = require('cors'); // Importa o middleware CORS para permitir requisições de diferentes origens
const pool = require('./db'); // Importa o pool de conexões do banco de dados PostgreSQL
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para criar e verificar tokens JWT
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para hash e verificação de senhas

const app = express(); // Cria uma instância do aplicativo Express

// Configurar CORS para permitir requisições do frontend hospedado no Vercel
app.use(cors({ 
  origin: 'https://projeto-to-do-list-nw1ytcesw-gabriel-pereira-s-projects.vercel.app', // Substitua pela URL do seu frontend no Vercel
  credentials: true,
}));

// Middleware para parsear requisições JSON
app.use(express.json()); 

// Função para gerar tokens JWT
const generateToken = (id) => {
  return jwt.sign({ id }, 'secreta_chave_jwt', { expiresIn: '1h' });
};

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado' });
  
  try {
    const verified = jwt.verify(token, 'secreta_chave_jwt');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

// Rotas de Registro e Login
app.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, celular } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, celular) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, hashedPassword, celular]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no registro');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(senha, user.rows[0].senha);
      if (!validPassword) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }
      const token = generateToken(user.rows[0].usuario_id);
      res.json({ token, user: user.rows[0] });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no login');
  }
});

// Rotas de Tarefas
app.post('/tarefas', authenticateToken, async (req, res) => {
  try {
    const { titulo, descricao, data_vencimento, prioridade } = req.body;
    const newTarefa = await pool.query(
      'INSERT INTO tarefas (titulo, descricao, data_vencimento, prioridade, status_conclusao, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descricao, data_vencimento, prioridade, false, req.user.id]
    );
    res.json(newTarefa.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao adicionar tarefa');
  }
});

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

app.get('/tarefas', authenticateToken, async (req, res) => {
  try {
    const allTarefas = await pool.query('SELECT * FROM tarefas WHERE usuario_id = $1', [req.user.id]);
    res.json(allTarefas.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao obter tarefas');
  }
});

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

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

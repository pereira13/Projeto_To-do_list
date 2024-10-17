import React, { Fragment, useState, useEffect } from 'react'; // Importa React e hooks necessários
import axios from 'axios'; // Importa axios para fazer requisições HTTP

const App = () => {
  // Estado para armazenar a lista de tarefas
  const [todos, setTodos] = useState([]);
  // Estado para armazenar a descrição da nova tarefa
  const [description, setDescription] = useState('');

  // Função para pegar todas as tarefas
  const getTodos = async () => {
    try {
      // Faz uma requisição GET para obter as tarefas
      const response = await axios.get('https://projeto-to-do-list-w1q9.onrender.com/todos');
      // Atualiza o estado com a lista de tarefas recebida
      setTodos(response.data);
    } catch (err) {
      // Em caso de erro, imprime a mensagem de erro no console
      console.error(err.message);
    }
  };

  // Hook useEffect para carregar as tarefas quando o componente é montado
  useEffect(() => {
    getTodos(); // Chama a função para pegar as tarefas
  }, []); // O array vazio significa que isso roda apenas uma vez, após o primeiro render

  // Função para adicionar uma tarefa
  const addTodo = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const newTodo = { description }; // Cria um objeto com a descrição da nova tarefa
      // Faz uma requisição POST para adicionar a nova tarefa
      await axios.post('https://projeto-to-do-list-w1q9.onrender.com/todos', newTodo);
      getTodos(); // Atualiza a lista de tarefas
      setDescription(''); // Limpa o campo de entrada após adicionar a tarefa
    } catch (err) {
      // Em caso de erro, imprime a mensagem de erro no console
      console.error(err.message);
    }
  };

  // Função para deletar uma tarefa
  const deleteTodo = async (id) => {
    try {
      // Faz uma requisição DELETE para remover a tarefa pelo ID
      await axios.delete(`https://projeto-to-do-list-w1q9.onrender.com/todos/${id}`);
      getTodos(); // Atualiza a lista de tarefas após a remoção
    } catch (err) {
      // Em caso de erro, imprime a mensagem de erro no console
      console.error(err.message);
    }
  };

  return (
    <Fragment> {/* Usado para não criar um nó adicional no DOM */}
      <h1>Lista de Tarefas</h1> {/* Título da aplicação */}
      <form onSubmit={addTodo}> {/* Formulário para adicionar novas tarefas */}
        <input
          type="text"
          value={description} // Valor do campo de entrada ligado ao estado
          onChange={(e) => setDescription(e.target.value)} // Atualiza o estado com o valor digitado
          placeholder="Adicione uma nova tarefa" // Texto de placeholder para o campo de entrada
        />
        <button type="submit">Adicionar</button> {/* Botão para enviar o formulário */}
      </form>
      <ul> {/* Lista de tarefas */}
        {todos.map((todo) => ( // Mapeia cada tarefa para um item de lista
          <li key={todo.todo_id}> {/* Usar o ID da tarefa como chave */}
            {todo.description} {/* Exibe a descrição da tarefa */}
            <button onClick={() => deleteTodo(todo.todo_id)}>Deletar</button> {/* Botão para deletar a tarefa */}
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default App; // Exporta o componente App para uso em outras partes da aplicação

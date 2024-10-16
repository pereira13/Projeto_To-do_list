import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // Estados para armazenar as tarefas e descrição de novas tarefas
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');

  // Função para pegar todas as tarefas da API
  const getTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/todos');
      setTodos(response.data); // Atualiza o estado com as tarefas obtidas
    } catch (err) {
      console.error(err.message); // Mostra o erro no console
    }
  };

  // useEffect executa getTodos quando o componente é montado
  useEffect(() => {
    getTodos();
  }, []);

  // Função para adicionar uma nova tarefa
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const newTodo = { description };
      await axios.post('http://localhost:5000/todos', newTodo);
      getTodos(); // Atualiza a lista após adicionar
      setDescription(''); // Limpa o campo de descrição
    } catch (err) {
      console.error(err.message);
    }
  };

  // Função para deletar uma tarefa pelo ID
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      getTodos(); // Atualiza a lista após deletar
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1>Lista de Tarefas</h1>
      <form onSubmit={addTodo}>
        {/* Campo para digitar a descrição da tarefa */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {/* Lista de tarefas */}
        {todos.map((todo) => (
          <li key={todo.todo_id}>
            {todo.description}
            <button onClick={() => deleteTodo(todo.todo_id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default App;

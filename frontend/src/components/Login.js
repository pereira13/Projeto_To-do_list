import React, { useState } from 'react'; // Importa React e useState para gerenciar estado local
import axios from 'axios'; // Importa axios para fazer requisições HTTP
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionar o usuário

function Login({ setToken, setUser }) {
  // Estado para armazenar o email e a senha do usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Hook para redirecionar o usuário após login
  const navigate = useNavigate(); 

  // Função para lidar com o evento de login
  const handleLogin = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      // Corrigir a URL removendo a barra duplicada
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, senha });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/tarefas'); 
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };
  

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}> {/* Chama handleLogin ao enviar o formulário */}
        <input
          type="email" // Campo para o email do usuário
          value={email}
          onChange={(event) => setEmail(event.target.value)} // Atualiza o estado do email ao digitar
          placeholder="Email" // Placeholder do campo
        />
        <input
          type="password" // Campo para a senha do usuário
          value={senha}
          onChange={(event) => setSenha(event.target.value)} // Atualiza o estado da senha ao digitar
          placeholder="Senha" // Placeholder do campo
        />
        <button type="submit">Login</button> {/* Botão para enviar o formulário */}
      </form>
      <br />
      <button onClick={() => window.location.href='/register'}>Registrar-se</button> {/* Botão que redireciona para a página de registro */}
    </div>
  );
}

export default Login; // Exporta o componente Login para uso em outras partes da aplicação

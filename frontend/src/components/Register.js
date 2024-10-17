import React, { useState } from 'react'; // Importa React e useState para gerenciar o estado local
import axios from 'axios'; // Importa axios para fazer requisições HTTP

function Register() {
  // Estado para armazenar as informações do usuário
  const [email, setEmail] = useState(''); // Estado para o email
  const [senha, setSenha] = useState(''); // Estado para a senha
  const [nome, setNome] = useState(''); // Estado para o nome
  const [celular, setCelular] = useState(''); // Estado para o celular

  // Função para lidar com o registro do usuário
  const handleRegister = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      // Faz uma requisição POST para o endpoint de registro
      const response = await axios.post('http://localhost:5000/register', { nome, email, senha, celular });
      console.log('Usuário registrado:', response.data); // Exibe a resposta no console após o registro bem-sucedido
      
      // Redireciona para a página inicial após o registro
      window.location.href = '/'; 
    } catch (error) {
      // Exibe um erro no console se a requisição falhar
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1> {/* Título da página de registro */}
      <form onSubmit={handleRegister}> {/* Chama handleRegister ao enviar o formulário */}
        <input
          type="text"
          value={nome} // O valor do campo é controlado pelo estado
          onChange={(event) => setNome(event.target.value)} // Atualiza o estado ao digitar
          placeholder="Nome" // Placeholder do campo
        />
        <input
          type="email"
          value={email} // O valor do campo é controlado pelo estado
          onChange={(event) => setEmail(event.target.value)} // Atualiza o estado ao digitar
          placeholder="Email" // Placeholder do campo
        />
        <input
          type="password"
          value={senha} // O valor do campo é controlado pelo estado
          onChange={(event) => setSenha(event.target.value)} // Atualiza o estado ao digitar
          placeholder="Senha" // Placeholder do campo
        />
        <input
          type="text"
          value={celular} // O valor do campo é controlado pelo estado
          onChange={(event) => setCelular(event.target.value)} // Atualiza o estado ao digitar
          placeholder="Celular" // Placeholder do campo
        />
        <button type="submit">Registrar</button> {/* Botão para enviar o formulário */}
      </form>
    </div>
  );
}

export default Register; // Exporta o componente Register para uso em outras partes da aplicação

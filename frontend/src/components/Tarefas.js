import React, { useState, useEffect } from 'react'; // Importa React, useState e useEffect
import axios from 'axios'; // Importa axios para fazer requisições HTTP
import { format } from 'date-fns'; // Importa format para formatar datas
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesome para ícones
import { faEdit, faTrash, faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons'; // Importa ícones específicos

function Tarefas({ token }) {
  // Estado para armazenar a lista de tarefas e informações do formulário
  const [tarefas, setTarefas] = useState([]); // Lista de tarefas
  const [titulo, setTitulo] = useState(''); // Título da tarefa
  const [descricao, setDescricao] = useState(''); // Descrição da tarefa
  const [dataVencimento, setDataVencimento] = useState(''); // Data de vencimento da tarefa
  const [prioridade, setPrioridade] = useState('media'); // Prioridade da tarefa
  const [editTarefaId, setEditTarefaId] = useState(null); // ID da tarefa em edição
  const [editTarefa, setEditTarefa] = useState({}); // Dados da tarefa em edição
  const [filter, setFilter] = useState('todas'); // Filtro de tarefas
  const [dataInicio, setDataInicio] = useState(''); // Data de início para o filtro
  const [dataFim, setDataFim] = useState(''); // Data de fim para o filtro
  const [filtroPrioridade, setFiltroPrioridade] = useState(''); // Filtro de prioridade
  const [error, setError] = useState(''); // Mensagem de erro

  // Efeito para buscar tarefas do servidor quando o componente é montado
  useEffect(() => {
    const fetchTarefas = async () => {
      const response = await axios.get('http://localhost:5000/tarefas', {
        headers: { Authorization: `Bearer ${token}` }, // Inclui o token de autenticação
      });
      setTarefas(response.data); // Atualiza o estado com a lista de tarefas recebida
    };
    fetchTarefas(); // Chama a função para buscar tarefas
  }, [token]); // Reexecuta o efeito sempre que o token mudar

  // Função para adicionar uma nova tarefa
  const handleAddTarefa = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (!titulo || !dataVencimento) {
      setError('Título e Data de Vencimento são obrigatórios'); // Valida campos obrigatórios
      return;
    }
    try {
      // Cria um novo objeto de tarefa
      const newTarefa = { titulo, descricao, data_vencimento: dataVencimento, prioridade };
      const response = await axios.post('http://localhost:5000/tarefas', newTarefa, {
        headers: { Authorization: `Bearer ${token}` }, // Inclui o token de autenticação
      });
      // Atualiza a lista de tarefas com a nova tarefa adicionada
      setTarefas([...tarefas, response.data]);
      // Limpa os campos do formulário
      setTitulo('');
      setDescricao('');
      setDataVencimento('');
      setPrioridade('media');
      setError(''); // Reseta mensagem de erro
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error); // Loga o erro no console
    }
  };

  // Função para atualizar a tarefa diretamente na tabela
  const handleUpdateTarefa = async (id, updatedTarefa) => {
    try {
      await axios.put(`http://localhost:5000/tarefas/${id}`, updatedTarefa, {
        headers: { Authorization: `Bearer ${token}` }, // Inclui o token de autenticação
      });
      // Atualiza a lista de tarefas com os dados da tarefa editada
      setTarefas(
        tarefas.map((tarefa) => (tarefa.tarefa_id === id ? { ...tarefa, ...updatedTarefa } : tarefa))
      );
      setEditTarefaId(null); // Sair do modo de edição
      setEditTarefa({}); // Limpa os dados da tarefa em edição
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error); // Loga o erro no console
    }
  };

  // Habilitar edição de uma tarefa na tabela
  const handleEditTarefa = (tarefa) => {
    setEditTarefaId(tarefa.tarefa_id); // Define a tarefa atual como a que será editada
    setEditTarefa({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      data_vencimento: format(new Date(tarefa.data_vencimento), 'yyyy-MM-dd'), // Formata a data para o input
      prioridade: tarefa.prioridade
    });
  };

  // Salvar edição
  const handleSaveTarefa = (id) => {
    handleUpdateTarefa(id, editTarefa); // Chama a função de atualização
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditTarefaId(null); // Sair do modo de edição
    setEditTarefa({}); // Limpa os dados da tarefa em edição
  };

  // Alterar os valores editáveis
  const handleChangeEdit = (e) => {
    const { name, value } = e.target; // Obtém o nome e o valor do campo editável
    setEditTarefa((prev) => ({
      ...prev,
      [name]: value, // Atualiza o estado da tarefa em edição
    }));
  };

  // Função para deletar uma tarefa
  const handleDeleteTarefa = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tarefas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Inclui o token de autenticação
      });
      // Atualiza a lista de tarefas removendo a tarefa deletada
      setTarefas(tarefas.filter((tarefa) => tarefa.tarefa_id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error); // Loga o erro no console
    }
  };

  // Função para alternar o status de conclusão da tarefa
  const handleToggleConclusao = async (id) => {
    const tarefa = tarefas.find((t) => t.tarefa_id === id); // Encontra a tarefa pelo ID
    const updatedTarefa = { ...tarefa, status_conclusao: !tarefa.status_conclusao }; // Alterna o status
    await handleUpdateTarefa(id, updatedTarefa); // Chama a função de atualização
  };

  // Filtra as tarefas com base nos critérios selecionados
  const filteredTarefas = tarefas.filter((tarefa) => {
    if (filter === 'concluidas' && !tarefa.status_conclusao) return false;
    if (filter === 'naoConcluidas' && tarefa.status_conclusao) return false;
    if (filtroPrioridade && tarefa.prioridade !== filtroPrioridade) return false;
    const dataVencimento = new Date(tarefa.data_vencimento);
    if (dataInicio && new Date(dataInicio) > dataVencimento) return false;
    if (dataFim && new Date(dataFim) < dataVencimento) return false;
    return true;
  });

  return (
    <div className="tarefas-container">
      <h1>Tarefas</h1>

      {/* Formulário para adicionar tarefa */}
      <form onSubmit={handleAddTarefa} className="add-tarefa-form">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)} // Atualiza o título da nova tarefa
          placeholder="Título"
          required // Campo obrigatório
        />
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)} // Atualiza a descrição da nova tarefa
          placeholder="Descrição"
          required // Campo obrigatório
        />
        <input
          type="date"
          value={dataVencimento}
          onChange={(e) => setDataVencimento(e.target.value)} // Atualiza a data de vencimento da nova tarefa
          required // Campo obrigatório
        />
        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <button type="submit">Adicionar Tarefa</button> {/* Botão para adicionar tarefa */}
      </form>
      {error && <p className="error">{error}</p>} {/* Exibe mensagem de erro, se houver */}

      <table className="tarefas-tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Data de Vencimento</th>
            <th>Prioridade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredTarefas.map((tarefa) => (
            <tr
              key={tarefa.tarefa_id}
              className={`tarefa-item ${tarefa.status_conclusao ? 'tarefa-concluida' : 'tarefa-nao-concluida'}`}
            >
              {editTarefaId === tarefa.tarefa_id ? (
                <>
                  {/* Campos editáveis */}
                  <td>
                    <input
                      type="text"
                      name="titulo"
                      value={editTarefa.titulo}
                      onChange={handleChangeEdit} // Atualiza o título da tarefa em edição
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="descricao"
                      value={editTarefa.descricao}
                      onChange={handleChangeEdit} // Atualiza a descrição da tarefa em edição
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="data_vencimento"
                      value={editTarefa.data_vencimento}
                      onChange={handleChangeEdit} // Atualiza a data de vencimento da tarefa em edição
                    />
                  </td>
                  <td>
                    <select
                      name="prioridade"
                      value={editTarefa.prioridade}
                      onChange={handleChangeEdit} // Atualiza a prioridade da tarefa em edição
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Média</option>
                      <option value="baixa">Baixa</option>
                    </select>
                  </td>
                  <td className="tarefa-acoes">
                    <button onClick={() => handleSaveTarefa(tarefa.tarefa_id)} className="save-btn">
                      <FontAwesomeIcon icon={faSave} /> {/* Ícone de salvar */}
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-btn">
                      <FontAwesomeIcon icon={faTimes} /> {/* Ícone de cancelar */}
                    </button>
                  </td>
                </>
              ) : (
                <>
                  {/* Campos normais (não editáveis) */}
                  <td>{tarefa.titulo}</td>
                  <td>{tarefa.descricao}</td>
                  <td>{format(new Date(tarefa.data_vencimento), 'dd/MM/yyyy')}</td> {/* Formata a data */}
                  <td>{tarefa.prioridade}</td>
                  <td className="tarefa-acoes">
                    <button onClick={() => handleEditTarefa(tarefa)} className="edit-btn">
                      <FontAwesomeIcon icon={faEdit} /> {/* Ícone de editar */}
                    </button>
                    <button onClick={() => handleToggleConclusao(tarefa.tarefa_id)} className="status-btn">
                      <FontAwesomeIcon icon={tarefa.status_conclusao ? faTimes : faCheck} /> {/* Ícone de concluir ou desmarcar */}
                    </button>
                    <button onClick={() => handleDeleteTarefa(tarefa.tarefa_id)} className="delete-btn">
                      <FontAwesomeIcon icon={faTrash} /> {/* Ícone de deletar */}
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tarefas; // Exporta o componente Tarefas para uso em outras partes da aplicação

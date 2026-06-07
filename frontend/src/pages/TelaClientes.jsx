import { useState, useEffect } from 'react';
import clienteServices from '../services/clienteServices'; 

function TelaClientes() {
  const [clientes, setClientes] = useState([]);
  
  // Caixas de memória para o formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Função que busca os clientes do banco
  const carregarClientes = async () => {
    const dadosVindosDoDjango = await clienteServices.getClientes();
    setClientes(dadosVindosDoDjango);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // Função disparada quando o usuário clica no botão "Salvar"
  const handleSubmeter = async (e) => {
    e.preventDefault(); // Impede a página de recarregar do jeito antigo

    if (!nome || !cpf) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const novoCliente = { nome, cpf };
      
      // Envia para o Django através do serviço
      await clienteServices.cadastrarCliente(novoCliente);
      
      setMensagem("Cliente cadastrado com sucesso!");
      
      // Limpa os campos do formulário
      setNome('');
      setCpf('');
      
      // Atualiza a lista na tela na mesma hora para mostrar o novo cliente!
      carregarClientes();
    } catch (erro) {
      setMensagem("Erro ao cadastrar o cliente. Verifique os dados.");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Módulo de Clientes</h2>
      
      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmeter} style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Novo Cliente</h3>
        
        {mensagem && <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>{mensagem}</p>}

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>CPF:</label>
          <input 
            type="text" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Salvar Cliente
        </button>
      </form>

      {/* Listagem de Clientes */}
      <h3>Clientes Cadastrados</h3>
      {clientes.length === 0 ? (
        <p>Carregando clientes ou nenhum cliente encontrado...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {clientes.map((cliente) => (
            <li key={cliente.id} style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>
              <strong>{cliente.nome}</strong> - CPF: {cliente.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TelaClientes;
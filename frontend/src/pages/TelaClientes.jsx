import { useState, useEffect } from 'react';
import clienteServices from '../services/clienteServices'; 

function TelaClientes() {
  const [clientes, setClientes] = useState([]);
  
  // 1. Caixas de memória atualizadas para bater com todos os campos do Django
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregarClientes = async () => {
    const dadosVindosDoDjango = await clienteServices.getClientes();
    setClientes(dadosVindosDoDjango);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSubmeter = async (e) => {
    e.preventDefault();

    // Validação para garantir que nenhum campo obrigatório vá vazio
    if (!nome || !cpf || !dataNascimento || !endereco || !telefone) {
      setMensagem("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // 2. Montando o objeto exatamente com os nomes do seu models.py
      const novoCliente = { 
        nome, 
        cpf, 
        data_nascimento: dataNascimento, // O Django espera snake_case
        endereco, 
        telefone 
      };
      
      await clienteServices.cadastrarCliente(novoCliente);
      
      setMensagem("Cliente cadastrado com sucesso!");
      
      // Limpa todas as caixas de texto após o sucesso
      setNome('');
      setCpf('');
      setDataNascimento('');
      setEndereco('');
      setTelefone('');
      
      carregarClientes();
    } catch (erro) {
      setMensagem("Erro ao cadastrar o cliente. Verifique se o CPF já existe.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Módulo de Clientes</h2>
      
      {/* Formulário de Cadastro Completo */}
      <form onSubmit={handleSubmeter} style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Novo Cliente</h3>
        
        {mensagem && <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>{mensagem}</p>}

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>CPF:</label>
          <input 
            type="text" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Data de Nascimento:</label>
          <input 
            type="date" // O tipo date já abre o calendário do navegador nativamente!
            value={dataNascimento} 
            onChange={(e) => setDataNascimento(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Telefone:</label>
          <input 
            type="text" 
            value={telefone} 
            onChange={(e) => setTelefone(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Endereço:</label>
          <textarea 
            value={endereco} 
            onChange={(e) => setEndereco(e.target.value)} 
            rows="3" // Transforma o input em um bloco maior de texto
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Salvar Cliente
        </button>
      </form>

      {/* Listagem de Clientes Exibindo os Novos Detalhes */}
      <h3>Clientes Cadastrados</h3>
      {clientes.length === 0 ? (
        <p>Carregando clientes ou nenhum cliente encontrado...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {clientes.map((cliente) => (
            <li key={cliente.id} style={{ padding: '12px', borderBottom: '1px solid var(--border)', lineHeight: '150%' }}>
              <strong>{cliente.nome}</strong> <br />
              <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                <strong>CPF:</strong> {cliente.cpf} | <strong>Telefone:</strong> {cliente.telefone} <br />
                <strong>Endereço:</strong> {cliente.endereco}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TelaClientes;
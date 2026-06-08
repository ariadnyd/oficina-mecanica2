import { useState } from 'react';
import clienteServices from '../../services/clienteServices'; 

function FormCliente({ aoCancelar, aoSalvarSucesso }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  // NOVA CAIXA DE MEMÓRIA: Guarda o ID do cliente se o Django avisar que ele tá inativo
  const [clienteInativoId, setClienteInativoId] = useState(null);

  const handleSubmeter = async (e) => {
    e.preventDefault();

    if (!nome || !cpf || !dataNascimento || !endereco || !telefone) {
      setMensagem("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const novoCliente = { 
        nome, cpf, data_nascimento: dataNascimento, endereco, telefone 
      };
      
      await clienteServices.cadastrarCliente(novoCliente);
      aoSalvarSucesso(); 
      
    } catch (erro) {
      // MÁGICA 1: O React intercepta o sinal de fumaça do Django!
      if (erro.inativo) {
        setMensagem(erro.mensagem); // "Este CPF pertence a um cliente inativo..."
        setClienteInativoId(erro.cliente_id); // Guarda o ID para poder reativar
      } else if (erro.mensagem) {
        setMensagem(erro.mensagem);
      } else {
        setMensagem("Erro de conexão com o servidor.");
      }
    }
  };

  // MÁGICA 2: A função que roda quando clicamos no botão de reativar
  const handleReativar = async () => {
    try {
      // Mandamos os dados preenchidos na tela para atualizar o cadastro no banco
      const dadosAtualizados = { nome, telefone, endereco };
      
      await clienteServices.reativarCliente(clienteInativoId, dadosAtualizados);
      
      // Avisa a tela principal que deu certo e recarrega a tabela!
      aoSalvarSucesso();
    } catch (erro) {
      setMensagem(erro.erro || "Erro ao tentar reativar o cliente.");
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Novo Cliente</h3>
        <button type="button" onClick={aoCancelar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>❌ Fechar</button>
      </div>
      
      {/* Se o cliente inativo for achado, a mensagem fica laranjinha de atenção. Senão, fica vermelha de erro normal */}
      {mensagem && (
        <p style={{ fontWeight: 'bold', color: clienteInativoId ? '#f0ad4e' : '#d9534f' }}>
          {mensagem}
        </p>
      )}

      <form onSubmit={handleSubmeter}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>CPF:</label>
            {/* Bloqueia a edição do CPF se estivermos no modo de reativação para evitar bugs */}
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={clienteInativoId !== null} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Data Nasc.:</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} disabled={clienteInativoId !== null} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Telefone:</label>
            <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Endereço:</label>
          <textarea value={endereco} onChange={(e) => setEndereco(e.target.value)} rows="2" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        {/* MÁGICA 3: O Botão Dinâmico! */}
        {clienteInativoId ? (
          <button type="button" onClick={handleReativar} style={{ padding: '10px 15px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
            Sim, Reativar Cadastro!
          </button>
        ) : (
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            Salvar Cliente
          </button>
        )}
      </form>
    </div>
  );
}

export default FormCliente;
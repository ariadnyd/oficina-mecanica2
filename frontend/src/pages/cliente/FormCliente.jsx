import { useState } from 'react';
// Note que agora são dois '../' porque entramos em mais uma pasta!
import clienteServices from '../../services/clienteServices'; 

function FormCliente({ aoCancelar, aoSalvarSucesso }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');

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
      // Avisa a tela principal que deu certo para ela recarregar a tabela!
      aoSalvarSucesso(); 
      
    } catch (erro) {
      if (erro.mensagem) {
        setMensagem(erro.mensagem);
      } else {
        setMensagem("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Novo Cliente</h3>
        <button onClick={aoCancelar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>❌ Fechar</button>
      </div>
      
      {mensagem && <p style={{ fontWeight: 'bold', color: '#d9534f' }}>{mensagem}</p>}

      <form onSubmit={handleSubmeter}>
        {/* Usando uma grade (grid) simples para deixar o formulário mais compacto */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>CPF:</label>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Data Nasc.:</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
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

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
          Salvar Cliente
        </button>
      </form>
    </div>
  );
}

export default FormCliente;
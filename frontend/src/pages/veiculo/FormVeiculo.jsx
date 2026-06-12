import { useState } from 'react';
import veiculoServices from '../../services/veiculoServices'; 

function FormVeiculo({ aoCancelar, aoSalvarSucesso, clientePreSelecionado }) {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  
  // Se a tela já souber o ID do cliente, ela guarda aqui. Se não, começa vazio.
  const [clienteId, setClienteId] = useState(clientePreSelecionado || '');
  const [mensagem, setMensagem] = useState('');

  const handleSubmeter = async (e) => {
    e.preventDefault();

    if (!placa || !marca || !modelo || !ano || !clienteId) {
      setMensagem("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // O campo "cliente" é obrigatório no seu models.py do Django!
      const novoVeiculo = { 
        placa, marca, modelo, ano, cliente: clienteId 
      };
      
      await veiculoServices.cadastrarVeiculo(novoVeiculo);
      aoSalvarSucesso(); 
      
    } catch (erro) {
      setMensagem(erro.erro || "Erro de conexão com o servidor ao cadastrar veículo.");
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Novo Veículo</h3>
        <button type="button" onClick={aoCancelar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>❌ Fechar</button>
      </div>
      
      {mensagem && <p style={{ fontWeight: 'bold', color: '#d9534f' }}>{mensagem}</p>}

      <form onSubmit={handleSubmeter}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          
          {/* Se a gente NÃO sabe quem é o cliente, exibe este campo para digitar o ID */}
          {!clientePreSelecionado && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>ID do Cliente Dono do Veículo:</label>
              <input type="number" value={clienteId} onChange={(e) => setClienteId(e.target.value)} placeholder="Ex: 5" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Placa:</label>
            <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="ABC-1234" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Ano:</label>
            <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} placeholder="Ex: 2020" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Marca:</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: Chevrolet" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Modelo:</label>
            <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Ex: Onix" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
          Salvar Veículo
        </button>
      </form>
    </div>
  );
}

export default FormVeiculo;
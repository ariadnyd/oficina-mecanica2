import { useState } from 'react';
import veiculoServices from '../../services/veiculoServices'; 

function FormVeiculo({ aoCancelar, aoSalvarSucesso, clientePreSelecionado }) {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipo, setTipo] = useState('');
  const [cor, setCor] = useState('');
  const [ano, setAno] = useState(''); // O ANO VOLTOU!
  
  const [cpfDono, setCpfDono] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [errosCampos, setErrosCampos] = useState({}); 

  const handleSubmeter = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErrosCampos({});

    // Validando todos os 6 campos agora
    if (!placa || !marca || !modelo || !tipo || !cor || !ano || (!clientePreSelecionado && !cpfDono)) {
      setMensagem("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const novoVeiculo = { placa, marca, modelo, tipo, cor, ano };
      
      if (clientePreSelecionado) {
        novoVeiculo.cliente = clientePreSelecionado;
      } else {
        novoVeiculo.cpf_dono = cpfDono;
      }
      
      await veiculoServices.cadastrarVeiculo(novoVeiculo);
      aoSalvarSucesso(); 
      
    } catch (erro) {
      setMensagem(erro.erro || "Erro de conexão com o servidor ao cadastrar veículo.");
      if (erro.detalhes) {
        setErrosCampos(erro.detalhes);
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Novo Veículo</h3>
        <button type="button" onClick={aoCancelar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>❌ Fechar</button>
      </div>
      
      {mensagem && <p style={{ fontWeight: 'bold', color: '#d9534f' }}>{mensagem}</p>}

      {Object.keys(errosCampos).length > 0 && (
        <div style={{ backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', color: '#721c24' }}>
          <strong>Raio-X do Erro (O que o Django dedurou):</strong>
          <ul style={{ margin: '5px 0 0', fontSize: '14px' }}>
            {Object.entries(errosCampos).map(([campo, mensagens_erro]) => (
              <li key={campo}><strong>{campo}:</strong> {mensagens_erro[0]}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmeter}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          
          {!clientePreSelecionado && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>CPF do Cliente Dono do Veículo:</label>
              <input type="text" value={cpfDono} onChange={(e) => setCpfDono(e.target.value)} placeholder="Ex: 00011122233" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.cpf_dono || errosCampos.cliente ? '2px solid #d9534f' : '1px solid var(--border)' }} />
              {(errosCampos.cpf_dono || errosCampos.cliente) && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.cpf_dono ? errosCampos.cpf_dono[0] : errosCampos.cliente[0]}</span>}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Placa:</label>
            <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="ABC-1234" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.placa ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.placa && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.placa[0]}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tipo:</label>
            <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Carro, Moto" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.tipo ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.tipo && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.tipo[0]}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Marca:</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: Chevrolet" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.marca ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.marca && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.marca[0]}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Modelo:</label>
            <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Ex: Onix" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.modelo ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.modelo && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.modelo[0]}</span>}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Cor:</label>
            <input type="text" value={cor} onChange={(e) => setCor(e.target.value)} placeholder="Ex: Prata" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.cor ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.cor && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.cor[0]}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Ano:</label>
            <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} placeholder="Ex: 2020" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.ano ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.ano && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.ano[0]}</span>}
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
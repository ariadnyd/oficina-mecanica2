import { useState, useEffect } from 'react';
import veiculoServices from '../../services/veiculoServices'; 

// Adicionamos a prop veiculoEmEdicao
function FormVeiculo({ aoCancelar, aoSalvarSucesso, clientePreSelecionado, veiculoEmEdicao }) {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipo, setTipo] = useState('');
  const [cor, setCor] = useState('');
  const [ano, setAno] = useState('');
  const [cpfDono, setCpfDono] = useState('');
  
  const [mensagem, setMensagem] = useState('');
  const [errosCampos, setErrosCampos] = useState({}); 

  // MÁGICA DO EDITAR: Preenche as caixinhas se o carro vier na memória!
  useEffect(() => {
    if (veiculoEmEdicao) {
      setPlaca(veiculoEmEdicao.placa || '');
      setMarca(veiculoEmEdicao.marca || '');
      setModelo(veiculoEmEdicao.modelo || '');
      setTipo(veiculoEmEdicao.tipo || '');
      setCor(veiculoEmEdicao.cor || '');
      setAno(veiculoEmEdicao.ano || '');
    }
  }, [veiculoEmEdicao]);

  const handleSubmeter = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErrosCampos({});

    // Validação: O CPF só é obrigatório se NÃO for edição e NÃO vier pelo atalho
    if (!placa || !marca || !modelo || !tipo || !cor || !ano || (!clientePreSelecionado && !cpfDono && !veiculoEmEdicao)) {
      setMensagem("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const dadosVeiculo = { placa, marca, modelo, tipo, cor, ano };
      
      // O SUPER INTERRUPTOR: Cadastrar ou Editar?
      if (veiculoEmEdicao) {
        await veiculoServices.editarVeiculo(veiculoEmEdicao.id, dadosVeiculo);
      } else {
        if (clientePreSelecionado) {
          dadosVeiculo.cliente = clientePreSelecionado;
        } else {
          dadosVeiculo.cpf_dono = cpfDono;
        }
        await veiculoServices.cadastrarVeiculo(dadosVeiculo);
      }
      
      aoSalvarSucesso(); 
      
    } catch (erro) {
      setMensagem(erro.erro || "Erro de conexão com o servidor ao salvar veículo.");
      if (erro.detalhes) {
        setErrosCampos(erro.detalhes);
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Título dinâmico */}
        <h3>{veiculoEmEdicao ? "Editar Veículo" : "Novo Veículo"}</h3>
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
          
          {/* Esconde o campo de CPF se estivermos editando um veículo existente */}
          {!clientePreSelecionado && !veiculoEmEdicao && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>CPF do Cliente Dono do Veículo:</label>
              <input type="text" value={cpfDono} onChange={(e) => setCpfDono(e.target.value)} placeholder="Ex: 00011122233" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.cpf_dono || errosCampos.cliente ? '2px solid #d9534f' : '1px solid var(--border)' }} />
              {(errosCampos.cpf_dono || errosCampos.cliente) && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.cpf_dono ? errosCampos.cpf_dono[0] : errosCampos.cliente[0]}</span>}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Placa:</label>
            <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} disabled={!!veiculoEmEdicao} placeholder="ABC-1234" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.placa ? '2px solid #d9534f' : '1px solid var(--border)' }} />
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
          {veiculoEmEdicao ? "Salvar Alterações" : "Salvar Veículo"}
        </button>
      </form>
    </div>
  );
}

export default FormVeiculo;
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import veiculoServices from '../../services/veiculoServices';
import FormVeiculo from './FormVeiculo'; // Importando a peça de Lego nova!

function TelaVeiculos() {
  const [searchParams] = useSearchParams();
  const clienteIdNaUrl = searchParams.get('cliente_id');

  const [cpfBusca, setCpfBusca] = useState('');
  const [veiculos, setVeiculos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [buscou, setBuscou] = useState(false);
  
  // O Interruptor do Formulário
  const [exibirFormulario, setExibirFormulario] = useState(false);

  useEffect(() => {
    if (clienteIdNaUrl) {
      buscarVeiculos({ cliente_id: clienteIdNaUrl });
    }
  }, [clienteIdNaUrl]);

  const buscarVeiculos = async (filtros) => {
    setMensagem('Buscando veículos...');
    try {
      const dados = await veiculoServices.getVeiculos(filtros);
      setVeiculos(dados);
      setMensagem('');
      setBuscou(true);
    } catch (erro) {
      setMensagem("Erro ao buscar os veículos.");
      setVeiculos([]);
    }
  };

  const handlePesquisarCPF = (e) => {
    e.preventDefault();
    if (!cpfBusca) {
      setMensagem("Por favor, digite um CPF para buscar.");
      return;
    }
    buscarVeiculos({ cpf: cpfBusca });
  };

  const handleSalvarSucesso = () => {
    setExibirFormulario(false);
    // Recarrega a lista dependendo de onde o usuário está
    if (clienteIdNaUrl) {
      buscarVeiculos({ cliente_id: clienteIdNaUrl });
    } else if (cpfBusca) {
      buscarVeiculos({ cpf: cpfBusca });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Módulo de Veículos</h2>
        
        {/* BOTÃO DE CADASTRAR NO TOPO */}
        {!exibirFormulario && (
          <button 
            onClick={() => setExibirFormulario(true)}
            style={{ padding: '10px 15px', backgroundColor: 'var(--text-h)', color: 'var(--bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Cadastrar Novo Veículo
          </button>
        )}
      </div>

      {/* EXIBE O FORMULÁRIO SE O INTERRUPTOR ESTIVER LIGADO */}
      {exibirFormulario && (
        <FormVeiculo 
          clientePreSelecionado={clienteIdNaUrl} // Passa o ID se veio pelo atalho!
          aoCancelar={() => setExibirFormulario(false)}
          aoSalvarSucesso={handleSalvarSucesso}
        />
      )}

      {/* A BARRA DE PESQUISA SOME SE O FORMULÁRIO ESTIVER ABERTO OU SE VEIO PELO ATALHO */}
      {!exibirFormulario && !clienteIdNaUrl && (
        <form onSubmit={handlePesquisarCPF} style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Buscar por CPF do Cliente:</label>
            <input 
              type="text" 
              value={cpfBusca} 
              onChange={(e) => setCpfBusca(e.target.value)} 
              placeholder="Digite o CPF (ex: 00011122233)"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--text-h)', color: 'var(--bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>
            🔍 Buscar
          </button>
        </form>
      )}

      {mensagem && <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>{mensagem}</p>}

      {!exibirFormulario && buscou && (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          {clienteIdNaUrl && (
            <Link to={`/clientes/${clienteIdNaUrl}`} style={{ display: 'inline-block', marginBottom: '15px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>
              ← Voltar para o Detalhe do Cliente
            </Link>
          )}
          
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--social-bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Placa</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Marca/Modelo</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Ano</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th> {/* NOVA COLUNA */}
              </tr>
            </thead>
            <tbody>
              {veiculos.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Nenhum veículo encontrado para este cliente.</td>
                </tr>
              ) : (
                veiculos.map((veiculo) => (
                  <tr key={veiculo.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{veiculo.placa}</td>
                    <td style={{ padding: '12px' }}>{veiculo.marca} {veiculo.modelo}</td>
                    <td style={{ padding: '12px' }}>{veiculo.ano}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {/* BOTÕES POSICIONADOS COMO VOCÊ PEDIU */}
                      <button style={{ marginRight: '8px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f0ad4e', border: 'none', borderRadius: '4px', color: '#fff' }}>Editar</button>
                      <button style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#d9534f', border: 'none', borderRadius: '4px', color: '#fff' }}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TelaVeiculos;
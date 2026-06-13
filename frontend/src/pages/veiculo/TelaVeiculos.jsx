import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import veiculoServices from '../../services/veiculoServices';
import FormVeiculo from './FormVeiculo'; 

function TelaVeiculos() {
  const [searchParams] = useSearchParams();
  const clienteIdNaUrl = searchParams.get('cliente_id');

  const [cpfBusca, setCpfBusca] = useState('');
  const [veiculos, setVeiculos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [buscou, setBuscou] = useState(false);
  const [exibirFormulario, setExibirFormulario] = useState(false);
  
  // CAIXA DE MEMÓRIA DO VEÍCULO
  const [veiculoEmEdicao, setVeiculoEmEdicao] = useState(null);

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
    setVeiculoEmEdicao(null); // Limpa a memória
    if (clienteIdNaUrl) {
      buscarVeiculos({ cliente_id: clienteIdNaUrl });
    } else if (cpfBusca) {
      buscarVeiculos({ cpf: cpfBusca });
    }
  };

  // A FUNÇÃO DO BOTÃO EDITAR
  const handleAbrirEdicao = (veiculo) => {
    setVeiculoEmEdicao(veiculo);
    setExibirFormulario(true);
  };

  const handleExcluir = async (id, placa) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o veículo de placa ${placa}?`);
    
    if (confirmacao) {
      try {
        const resposta = await veiculoServices.excluirVeiculo(id);
        alert(resposta.mensagem || "Veículo excluído com sucesso!");
        
        // Recarrega a tabela para o carro sumir da tela na mesma hora
        if (clienteIdNaUrl) {
          buscarVeiculos({ cliente_id: clienteIdNaUrl });
        } else if (cpfBusca) {
          buscarVeiculos({ cpf: cpfBusca });
        }
      } catch (erro) {
        alert(erro.erro || "Erro ao tentar excluir o veículo.");
      }
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Módulo de Veículos</h2>
        
        {!exibirFormulario && (
          <button 
            onClick={() => {
              setVeiculoEmEdicao(null);
              setExibirFormulario(true);
            }}
            style={{ padding: '10px 15px', backgroundColor: 'var(--text-h)', color: 'var(--bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Cadastrar Novo Veículo
          </button>
        )}
      </div>

      {exibirFormulario && (
        <FormVeiculo 
          clientePreSelecionado={clienteIdNaUrl}
          veiculoEmEdicao={veiculoEmEdicao} // Passando o bastão!
          aoCancelar={() => {
            setExibirFormulario(false);
            setVeiculoEmEdicao(null);
          }}
          aoSalvarSucesso={handleSalvarSucesso}
        />
      )}

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
                <th style={{ padding: '12px', textAlign: 'left' }}>Veículo</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cor</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ano</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Nenhum veículo encontrado para este cliente.</td>
                </tr>
              ) : (
                veiculos.map((veiculo) => (
                  <tr key={veiculo.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{veiculo.placa}</td>
                    <td style={{ padding: '12px' }}>{veiculo.tipo} - {veiculo.marca} {veiculo.modelo}</td>
                    <td style={{ padding: '12px' }}>{veiculo.cor}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{veiculo.ano}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button 
                            onClick={() => handleAbrirEdicao(veiculo)} 
                            style={{ marginRight: '8px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f0ad4e', border: 'none', borderRadius: '4px', color: '#fff' }}
                        >
                            Editar
                        </button>
                        <button 
                            onClick={() => handleExcluir(veiculo.id, veiculo.placa)}
                            style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#d9534f', border: 'none', borderRadius: '4px', color: '#fff' }}
                        >
                            Excluir
                        </button>
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
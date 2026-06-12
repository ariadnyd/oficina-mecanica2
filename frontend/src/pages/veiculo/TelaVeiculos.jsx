import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import veiculoServices from '../../services/veiculoServices';

function TelaVeiculos() {
  // O Leitor de URL: Descobre se a gente clicou no botão lá do cliente!
  const [searchParams] = useSearchParams();
  const clienteIdNaUrl = searchParams.get('cliente_id');

  const [cpfBusca, setCpfBusca] = useState('');
  const [veiculos, setVeiculos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [buscou, setBuscou] = useState(false); // Pra saber se a gente já fez alguma pesquisa

  // MÁGICA 1: Se a tela abrir e tiver um ID na URL, ela busca os carros sozinha!
  useEffect(() => {
    if (clienteIdNaUrl) {
      buscarVeiculos({ cliente_id: clienteIdNaUrl });
    }
  }, [clienteIdNaUrl]);

  // Função central para pedir os veículos ao Django
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

  // MÁGICA 2: A função da Lupinha (quando o usuário digita o CPF manualmente)
  const handlePesquisarCPF = (e) => {
    e.preventDefault();
    if (!cpfBusca) {
      setMensagem("Por favor, digite um CPF para buscar.");
      return;
    }
    buscarVeiculos({ cpf: cpfBusca });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
      
      <h2>Módulo de Veículos</h2>

      {/* A BARRA DE PESQUISA (Só aparece se a pessoa NÃO tiver vindo pelo atalho) */}
      {!clienteIdNaUrl && (
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

      {/* A TABELA DE RESULTADOS */}
      {buscou && (
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
              </tr>
            </thead>
            <tbody>
              {veiculos.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Nenhum veículo encontrado para este cliente.</td>
                </tr>
              ) : (
                veiculos.map((veiculo) => (
                  <tr key={veiculo.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* Ajuste os nomes "placa", "marca", "modelo" e "ano" de acordo com o seu models.py do Django! */}
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{veiculo.placa}</td>
                    <td style={{ padding: '12px' }}>{veiculo.marca} {veiculo.modelo}</td>
                    <td style={{ padding: '12px' }}>{veiculo.ano}</td>
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
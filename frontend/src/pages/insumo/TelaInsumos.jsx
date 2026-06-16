import { useState, useEffect } from 'react';
import api from '../../services/api';
import FormInsumo from './FormInsumo';

function TelaInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [insumoEmEdicao, setInsumoEmEdicao] = useState(null);
  
  // CAIXA DE MEMÓRIA PARA A BUSCA (Igual a de Clientes)
  const [termoBusca, setTermoBusca] = useState('');

  const carregarInsumos = async () => {
    try {
      const resposta = await api.get('core/insumo/');
      setInsumos(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar insumos", erro);
    }
  };

  useEffect(() => {
    carregarInsumos();
  }, []);

  const handleSalvarSucesso = () => {
    setExibirFormulario(false);
    setInsumoEmEdicao(null);
    carregarInsumos();
  };

  const handleAbrirEdicao = (insumo) => {
    setInsumoEmEdicao(insumo);
    setExibirFormulario(true);
  };

  const handleExcluir = async (id, nome) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o insumo ${nome}?`);
    if (confirmacao) {
      try {
        await api.delete(`core/insumo/${id}/`);
        carregarInsumos();
      } catch (erro) {
        alert("Erro ao excluir. Tente novamente.");
        console.error(erro);
      }
    }
  };

  // Lógica da barra de pesquisa
  const insumosFiltrados = insumos.filter((insumo) => {
    const termo = termoBusca.toLowerCase();
    return (
      insumo.nome.toLowerCase().includes(termo) ||
      insumo.marca.toLowerCase().includes(termo)
    );
  });

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h2 style={{ color: 'var(--text)', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
        📦 Gestão de Insumos
      </h2>

      {/* RENDERIZAÇÃO CONDICIONAL: Mostra o Form ou a Lista */}
      {exibirFormulario ? (
        <FormInsumo 
          aoCancelar={() => {
            setExibirFormulario(false);
            setInsumoEmEdicao(null);
          }} 
          aoSalvarSucesso={handleSalvarSucesso}
          insumoEmEdicao={insumoEmEdicao}
        />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <button 
              onClick={() => setExibirFormulario(true)}
              style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➕ Cadastrar Novo Insumo
            </button>
            
            {/* Barra de Pesquisa */}
            <input 
              type="text" 
              placeholder="Buscar por nome ou marca..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'var(--social-bg)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Marca</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Qtd</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {insumosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhum insumo encontrado.
                  </td>
                </tr>
              ) : (
                insumosFiltrados.map((insumo) => (
                  <tr key={insumo.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{insumo.nome}</td>
                    <td style={{ padding: '12px' }}>{insumo.marca}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ backgroundColor: insumo.quantidade > 0 ? '#5cb85c' : '#d9534f', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                        {insumo.quantidade}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleAbrirEdicao(insumo)} 
                        style={{ marginRight: '8px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f0ad4e', border: 'none', borderRadius: '4px', color: '#fff' }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(insumo.id, insumo.nome)}
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

export default TelaInsumos;
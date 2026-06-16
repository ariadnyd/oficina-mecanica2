import { useState, useEffect } from 'react';
import api from '../../services/api';

function TelaInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [formData, setFormData] = useState({ nome: '', marca: '', descricao: '', quantidade: 0 });
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' }); // tipo: 'sucesso' ou 'erro'

  const carregarInsumos = async () => {
    try {
      const resposta = await api.get('core/insumo/'); // Ajuste a rota se estiver diferente no seu urls.py
      setInsumos(resposta.data);
    } catch (erro) {
      mostrarMensagem('Erro ao carregar o estoque.', 'erro');
      console.error(erro);
    }
  };

  useEffect(() => {
    carregarInsumos();
  }, []);

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação de preenchimento obrigatório (RN01)
    if (!formData.nome || !formData.marca || !formData.descricao) {
      mostrarMensagem('Atenção: Os campos Nome, Marca e Descrição devem ser preenchidos.', 'erro');
      return;
    }

    try {
      if (editandoId) {
        // Atualizar
        await api.put(`core/insumo/${editandoId}/`, formData);
        mostrarMensagem('Dados do insumo atualizados com sucesso!', 'sucesso');
      } else {
        // Cadastrar Novo
        await api.post('core/insumo/', formData);
        mostrarMensagem('Insumo cadastrado com sucesso!', 'sucesso');
      }
      setFormData({ nome: '', marca: '', descricao: '', quantidade: 0 });
      setEditandoId(null);
      carregarInsumos();
    } catch (erro) {
      // Capturando erro de duplicidade do Django (unique_together)
      if (erro.response?.data?.non_field_errors) {
        mostrarMensagem('Erro: Já existe um insumo cadastrado com o mesmo nome e marca.', 'erro');
      } else {
        mostrarMensagem('Erro: Informações inválidas detectadas. Verifique os dados.', 'erro');
      }
      console.error(erro);
    }
  };

  const handleEditar = (insumo) => {
    setFormData({ 
      nome: insumo.nome, 
      marca: insumo.marca, 
      descricao: insumo.descricao, 
      quantidade: insumo.quantidade 
    });
    setEditandoId(insumo.id);
    window.scrollTo(0, 0);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este insumo do sistema?')) {
      try {
        await api.delete(`core/insumo/${id}/`);
        mostrarMensagem('O insumo foi desativado com sucesso!', 'sucesso');
        carregarInsumos();
      } catch (erro) {
        mostrarMensagem('Erro: Não foi possível desativar o insumo.', 'erro');
        console.error(erro);
      }
    }
  };

  const cancelarEdicao = () => {
    setFormData({ nome: '', marca: '', descricao: '', quantidade: 0 });
    setEditandoId(null);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h2>📦 Gerenciar Insumos e Peças</h2>
      
      {mensagem.texto && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: mensagem.tipo === 'sucesso' ? '#dff0d8' : '#f2dede', 
          color: mensagem.tipo === 'sucesso' ? '#3c763d' : '#a94442',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {mensagem.texto}
        </div>
      )}

      {/* Formulário de Cadastro / Edição */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Nome do Insumo:*</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Marca:*</label>
            <input type="text" name="marca" value={formData.marca} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>
        
        <div>
          <label>Descrição:*</label>
          <textarea name="descricao" value={formData.descricao} onChange={handleChange} required style={{ width: '100%', padding: '8px', minHeight: '60px' }} />
        </div>

        <div>
          <label>Quantidade em Estoque:</label>
          <input type="number" name="quantidade" step="0.01" value={formData.quantidade} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editandoId ? '💾 Atualizar Insumo' : '➕ Cadastrar Insumo'}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabela de Estoque */}
      <h3 style={{ marginTop: '30px' }}>📊 Estoque Atual</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: 'var(--social-bg)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Marca</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Qtd</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{insumo.nome}</td>
              <td style={{ padding: '12px' }}>{insumo.marca}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ 
                  backgroundColor: insumo.quantidade > 0 ? '#5cb85c' : '#d9534f', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '12px' 
                }}>
                  {insumo.quantidade}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button onClick={() => handleEditar(insumo)} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Editar</button>
                <button onClick={() => handleExcluir(insumo.id)} style={{ padding: '6px 12px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Excluir</button>
              </td>
            </tr>
          ))}
          {insumos.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhum insumo cadastrado ou ativo.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TelaInsumos;
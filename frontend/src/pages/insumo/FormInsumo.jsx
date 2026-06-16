import { useState, useEffect } from 'react';
import api from '../../services/api';

function FormInsumo({ aoCancelar, aoSalvarSucesso, insumoEmEdicao }) {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Preenche os campos se for edição
  useEffect(() => {
    if (insumoEmEdicao) {
      setNome(insumoEmEdicao.nome || '');
      setMarca(insumoEmEdicao.marca || '');
      setDescricao(insumoEmEdicao.descricao || '');
      setQuantidade(insumoEmEdicao.quantidade || 0);
    }
  }, [insumoEmEdicao]);

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
  };

  const handleSubmeter = async (e) => {
    e.preventDefault();

    if (!nome || !marca || !descricao) {
      mostrarMensagem("Por favor, preencha os campos obrigatórios (Nome, Marca e Descrição).", 'erro');
      return;
    }

    try {
      const dadosInsumo = { nome, marca, descricao, quantidade };

      if (insumoEmEdicao) {
        await api.put(`core/insumo/${insumoEmEdicao.id}/`, dadosInsumo);
      } else {
        await api.post('core/insumo/', dadosInsumo);
      }
      aoSalvarSucesso(); // Chama a função da Tela principal para recarregar e fechar o form
    } catch (erro) {
      if (erro.response?.data?.non_field_errors) {
        mostrarMensagem('Erro: Já existe um insumo com este nome e marca.', 'erro');
      } else {
        mostrarMensagem('Erro ao salvar os dados. Verifique as informações.', 'erro');
      }
      console.error(erro);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <h3 style={{ marginTop: 0 }}>{insumoEmEdicao ? '✏️ Editar Insumo' : '➕ Cadastrar Novo Insumo'}</h3>
      
      {mensagem.texto && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: mensagem.tipo === 'sucesso' ? '#dff0d8' : '#f2dede', color: mensagem.tipo === 'sucesso' ? '#3c763d' : '#a94442', borderRadius: '4px', fontWeight: 'bold' }}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmeter}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome:*</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Marca:*</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:*</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Quantidade:</label>
            <input type="number" step="0.01" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Salvar
          </button>
          <button type="button" onClick={aoCancelar} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormInsumo;
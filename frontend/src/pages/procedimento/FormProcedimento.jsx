import { useState, useEffect } from 'react';
import procedimentoServices from '../../services/procedimentoServices';

function FormProcedimento({ aoCancelar, aoSalvarSucesso, procedimentoEmEdicao }) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tempoMedio, setTempoMedio] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [mensagem, setMensagem] = useState('');
  const [errosCampos, setErrosCampos] = useState({});

  // Mágica do Editar: Preenche se vier um procedimento para alteração
  useEffect(() => {
    if (procedimentoEmEdicao) {
      setNome(procedimentoEmEdicao.nome || '');
      setValor(procedimentoEmEdicao.valor || '');
      setTempoMedio(procedimentoEmEdicao.tempo_medio || '');
      setDescricao(procedimentoEmEdicao.descricao || '');
    }
  }, [procedimentoEmEdicao]);

  const handleSubmeter = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErrosCampos({});

    // RN01 & MS08: Validação dos campos obrigatórios no Front-end
    if (!nome || !valor || !tempoMedio || !descricao) {
      setMensagem("Atenção: Os campos Nome, Valor, Tempo Médio e Descrição devem ser preenchidos corretamente.");
      return;
    }

    try {
      const dadosProcedimento = { nome, valor, tempo_medio: tempoMedio, descricao };

      if (procedimentoEmEdicao) {
        await procedimentoServices.editarProcedimento(procedimentoEmEdicao.id, dadosProcedimento);
      } else {
        await procedimentoServices.cadastrarProcedimento(dadosProcedimento);
      }

      aoSalvarSucesso();
    } catch (erro) {
      // Captura mensagens de erro amigáveis ou o Raio-X do Django
      setMensagem(erro.erro || "Erro: Informações inválidas detectadas. Por favor, insira os dados novamente.");
      if (erro.detalhes) {
        setErrosCampos(erro.detalhes);
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--social-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{procedimentoEmEdicao ? "Editar Procedimento" : "Novo Procedimento"}</h3>
        <button type="button" onClick={aoCancelar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>❌ Fechar</button>
      </div>

      {mensagem && <p style={{ fontWeight: 'bold', color: '#d9534f' }}>{mensagem}</p>}

      {/* Raio-X dos Erros do Django */}
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
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome do Serviço/Procedimento:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Alinhamento e Balanceamento" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.nome ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.nome && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.nome[0]}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Valor (R$):</label>
            <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.valor ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.valor && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.valor[0]}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tempo Médio Estimado:</label>
            <input type="text" value={tempoMedio} onChange={(e) => setTempoMedio(e.target.value)} placeholder="Ex: 45 min, 2 horas" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.tempo_medio ? '2px solid #d9534f' : '1px solid var(--border)' }} />
            {errosCampos.tempo_medio && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.tempo_medio[0]}</span>}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descrição Detalhada:</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" placeholder="Descreva o que é feito neste procedimento..." style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errosCampos.descricao ? '2px solid #d9534f' : '1px solid var(--border)' }} />
          {errosCampos.descricao && <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>{errosCampos.descricao[0]}</span>}
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
          {procedimentoEmEdicao ? "Salvar Alterações" : "Salvar Procedimento"}
        </button>
      </form>
    </div>
  );
}

export default FormProcedimento;
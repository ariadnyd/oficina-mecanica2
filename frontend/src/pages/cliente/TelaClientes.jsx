import { useState, useEffect } from 'react';
import clienteServices from '../../services/clienteServices';
import FormCliente from './FormCliente'; // Importando o seu arquivo novo!

function TelaClientes() {
  const [clientes, setClientes] = useState([]);
  const [exibirFormulario, setExibirFormulario] = useState(false);

  const carregarClientes = async () => {
    const dadosVindosDoDjango = await clienteServices.getClientes();
    setClientes(dadosVindosDoDjango);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // Função que o formulário vai chamar quando der sucesso
  const handleSalvarSucesso = () => {
    setExibirFormulario(false); // Esconde o formulário
    carregarClientes(); // Recarrega a tabela atualizada
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Módulo de Clientes</h2>
        
        {/* O botão fica no topo e muda a caixinha de memória para mostrar o formulário */}
        {!exibirFormulario && (
          <button 
            onClick={() => setExibirFormulario(true)}
            style={{ padding: '10px 15px', backgroundColor: 'var(--text-h)', color: 'var(--bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Cadastrar Novo Cliente
          </button>
        )}
      </div>

      {/* O Interruptor: Se for true, desenha o componente. Se for false, não faz nada. */}
      {exibirFormulario && (
        <FormCliente 
          aoCancelar={() => setExibirFormulario(false)} 
          aoSalvarSucesso={handleSalvarSucesso} 
        />
      )}

      {/* A Tabela de Clientes */}
      {!exibirFormulario && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--social-bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>CPF</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Telefone</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Nenhum cliente cadastrado.</td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>{cliente.nome}</td>
                    <td style={{ padding: '12px' }}>{cliente.cpf}</td>
                    <td style={{ padding: '12px' }}>{cliente.telefone}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
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

export default TelaClientes;
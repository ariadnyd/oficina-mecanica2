import { useState, useEffect } from 'react';
// Atenção aqui: colocamos '../' para o código voltar uma pasta e achar a 'services'
import clienteServices from '../services/clienteServices'; 

function TelaClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const carregarClientes = async () => {
      const dadosVindosDoDjango = await clienteServices.getClientes();
      setClientes(dadosVindosDoDjango);
    };

    carregarClientes();
  }, []);

  return (
    <div>
      <h2>Módulo de Clientes</h2>
      
      {clientes.length === 0 ? (
        <p>Carregando clientes ou nenhum cliente encontrado...</p>
      ) : (
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          {clientes.map((cliente) => (
            <li key={cliente.id} style={{ marginBottom: '10px' }}>
              <strong>Nome:</strong> {cliente.nome} <br />
              <strong>CPF:</strong> {cliente.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TelaClientes;
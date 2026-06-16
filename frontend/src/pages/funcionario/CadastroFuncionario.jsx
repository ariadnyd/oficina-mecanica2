import { useState } from 'react';
import api from '../../services/api';

function CadastroFuncionario() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/register/', { 
        username, 
        password, 
        is_staff: isStaff 
      });
      setMensagem('Funcionário cadastrado com sucesso!');
      setUsername('');
      setPassword('');
    } catch (erro) {
      setMensagem('Erro ao cadastrar. Verifique se você está logada como Admin.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid var(--border)' }}>
      <h2>Cadastro de Funcionário</h2>
      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>
          <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} />
          É Administrador?
        </label>
        <button type="submit" style={{ backgroundColor: '#5cb85c', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Cadastrar
        </button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default CadastroFuncionario;
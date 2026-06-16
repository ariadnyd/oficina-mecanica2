import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('Autenticando...');

    try {
      // Chama a rota de login do Django
      const resposta = await api.post('login/', { username, password });
      
      // Salva o token no navegador (localStorage)
      localStorage.setItem('access_token', resposta.data.access);
      localStorage.setItem('refresh_token', resposta.data.refresh);
      
      setMensagem('Login realizado com sucesso! Redirecionando...');
      
      // Redireciona para a tela inicial após 1 segundo
      setTimeout(() => {
        navigate('/clientes');
      }, 1000);
      
    } catch (erro) {
      setMensagem('Erro ao logar: Usuário ou senha inválidos.');
      console.error(erro);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h2>Login - Oficina 🚗</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Usuário:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      {mensagem && <p style={{ marginTop: '15px', textAlign: 'center', color: 'red' }}>{mensagem}</p>}
    </div>
  );
}

export default Login;
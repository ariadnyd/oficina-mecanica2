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
      // 1. Faz o login e pega os tokens
      const resposta = await api.post('auth/login/', { username, password });
      
      localStorage.setItem('access_token', resposta.data.access);
      localStorage.setItem('refresh_token', resposta.data.refresh);
      
      // Configura temporariamente o token no cabeçalho para a próxima busca
      api.defaults.headers.common['Authorization'] = `Bearer ${resposta.data.access}`;

      // 2. Faz uma chamada rápida para descobrir as permissões desse usuário logado
      // No Django, passamos o id ou usamos uma rota de perfil. Como seu UserDetailView espera a PK,
      // o jeito mais limpo é descriptografar o token ou pegar os dados. 
      // Para não quebrar seu backend, vamos verificar o perfil descriptografando o token JWT direto:
      const base64Url = resposta.data.access.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const dadosDoToken = JSON.parse(window.atob(base64));
      
      // O SimpleJWT por padrão não joga o is_staff direto no token a menos que seja customizado,
      // mas ele manda o user_id. Vamos buscar no backend usando o id que veio no token!
      const idUsuario = dadosDoToken.user_id;
      const dadosUsuario = await api.get(`auth/users/${idUsuario}/`);

      // Salva se o cara é admin (is_staff) no localStorage
      localStorage.setItem('is_admin', dadosUsuario.data.is_staff);
      
      setMensagem('Login realizado com sucesso! Redirecionando...');
      
      setTimeout(() => {
        navigate('/clientes');
      }, 1000);
      
    } catch (erro) {
      setMensagem('Erro ao logar: Usuário ou senha inválidos.');
      console.error(erro);
      localStorage.clear();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Login - Oficina 🚗</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Usuário:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Entrar
        </button>
      </form>
      {mensagem && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{mensagem}</p>}
    </div>
  );
}

export default Login;
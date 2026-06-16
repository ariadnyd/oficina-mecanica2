import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TelaClientes from './pages/cliente/TelaClientes';
import DetalhesCliente from './pages/cliente/DetalhesCliente';
import TelaVeiculos from './pages/veiculo/TelaVeiculos';
import TelaProcedimentos from './pages/procedimento/TelaProcedimentos'; // IMPORT DO SEU NOVO MÓDULO! 🛠️
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <h1>Sistema da Oficina Mecânica 🚗</h1>
        
        {/* Um menu de navegação vertical */}
        <nav style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link 
            to="/clientes" 
            style={{ padding: '15px', backgroundColor: 'var(--social-bg)', borderRadius: '8px', fontWeight: 'bold', color: 'var(--accent)', textDecoration: 'none', textAlign: 'center', border: '1px solid var(--border)' }}
          >
            👥 Ver Clientes
          </Link>
          <Link 
            to="/veiculos" 
            style={{ padding: '15px', backgroundColor: 'var(--social-bg)', borderRadius: '8px', fontWeight: 'bold', color: 'var(--accent)', textDecoration: 'none', textAlign: 'center', border: '1px solid var(--border)' }}
          >
            🚗 Módulo Veículos
          </Link>
          {/* NOVO BOTÃO NO MENU: Alinhadinho com o padrão do time */}
          <Link 
            to="/procedimentos" 
            style={{ padding: '15px', backgroundColor: 'var(--social-bg)', borderRadius: '8px', fontWeight: 'bold', color: 'var(--accent)', textDecoration: 'none', textAlign: 'center', border: '1px solid var(--border)' }}
          >
            🛠️ Gerenciar Procedimentos
          </Link>
        </nav>

        {/* O "GPS" que decide qual tela renderizar no meio da página */}
        <Routes>
          <Route path="/clientes" element={<TelaClientes />} />
          <Route path="/veiculos" element={<TelaVeiculos />} />
          {/* NOVA ROTA AQUI: O ":id" avisa o React que esse pedaço da URL é uma variável */}
          <Route path="/clientes/:id" element={<DetalhesCliente />} />
          
          {/* NOVA ROTA DE PROCEDIMENTOS */}
          <Route path="/procedimentos" element={<TelaProcedimentos />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
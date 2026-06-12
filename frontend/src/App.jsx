import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TelaClientes from './pages/cliente/TelaClientes';
import DetalhesCliente from './pages/cliente/DetalhesCliente';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <h1>Sistema da Oficina Mecânica 🚗</h1>
        
        {/* Um menu de navegação simples */}
        <nav style={{ marginBottom: '30px', padding: '10px', backgroundColor: 'var(--social-bg)', borderRadius: '8px' }}>
          <Link to="/clientes" style={{ fontWeight: 'bold' }}>Ver Clientes</Link>
        </nav>

        {/* O "GPS" que decide qual tela renderizar no meio da página */}
        <Routes>
          <Route path="/clientes" element={<TelaClientes />} />
          {/* NOVA ROTA AQUI: O ":id" avisa o React que esse pedaço da URL é uma variável */}
          <Route path="/clientes/:id" element={<DetalhesCliente />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
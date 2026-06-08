import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TelaClientes from './pages/cliente/TelaClientes';
import './App.css';
import TelaClientes from './pages/clientes/TelaClientes';

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
          {/* Futuramente, quando criar a OS, é só adicionar a rota dela aqui embaixo! */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
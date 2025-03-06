import './App.css';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Navbar } from './componentes/navbar';
import Dashboard from './pages/dashboard';
import Vehiculos from './pages/vehiculos';
import Talleres from './pages/talleres';
import RegistrosServicios from './pages/registros-servicios';
import Reportes from './pages/reportes';
import Configuracion from './pages/configuracion';
import PerfilUsuario from './pages/perfil-usuario';
import Login from './pages/login';
import Register from './pages/register';
import { authService } from './services/authService';

const App: React.FC = () => {
  const isLoggedIn = authService.isAuthenticated();

  return (
    <Router>
      {isLoggedIn && <Navbar />} {/* Mostrar Navbar solo si está logueado */}
      <div className="p-m-4">
        <Routes>
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/vehiculos" element={isLoggedIn ? <Vehiculos /> : <Navigate to="/login" />} />
          <Route path="/talleres" element={isLoggedIn ? <Talleres /> : <Navigate to="/login" />} />
          <Route path="/registros-servicios" element={isLoggedIn ? <RegistrosServicios /> : <Navigate to="/login" />} />
          <Route path="/reportes" element={isLoggedIn ? <Reportes /> : <Navigate to="/login" />} />
          <Route path="/configuracion" element={isLoggedIn ? <Configuracion /> : <Navigate to="/login" />} />
          <Route path="/perfil-usuario" element={isLoggedIn ? <PerfilUsuario /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

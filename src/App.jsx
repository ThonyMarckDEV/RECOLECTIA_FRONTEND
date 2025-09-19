//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from "./layouts/SidebarLayout.jsx";

// UIS AUTH
import ErrorPage404 from './components/ErrorPage404.jsx';
import ErrorPage401 from './components/ErrorPage401';
import Login from './ui/auth/Login/Login.jsx';

// UIS ADMIN
import HomeAdmin from './ui/admin/home.jsx';
import AgregarRecolector from './ui/admin/recolectores/AgregrarRecolector/Recolector.jsx';
import ListarRecolectores from './ui/admin/recolectores/ListarRecolectores/listarRecolectores.jsx';

// UIS Usuario
import HomeUsuario from './ui/usuario/home.jsx';
import Perfil from './ui/usuario/perfil/Perfil.jsx';
import HacerReporte from './ui/usuario/reportes/HacerReporte/Report.jsx';
import MisReportes from './ui/usuario/reportes/MisReportes/MisReportes.jsx';



// UIS Recolector
import HomeRecolector from './ui/recolector/home.jsx';

// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteUsuario from './utilities/ProtectedRouteUsuario.jsx';
import ProtectedRouteAdmin from './utilities/ProtectedRouteAdmin.jsx';
import ProtectedRouteRecolector from './utilities/ProtectedRouteRecolector.jsx';


function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={<ProtectedRouteHome element={<Login />} />}
      />

      {/* RUTAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteAdmin element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /admin) */}
        <Route index element={<HomeAdmin />} />

        {/* Ruta para agregar recolectores */}
        <Route path="agregar-recolector" element={<AgregarRecolector />} />
        {/* Ruta para listar recolectores */}
        <Route path="listar-recolectores" element={<ListarRecolectores />} />

        {/* Aquí agregas más módulos */}

      </Route>



      {/* RUTAS USUARIO */}
      <Route
        path="/usuario"
        element={
          <ProtectedRouteUsuario element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /usuario) */}
        <Route index element={<HomeUsuario />} />

        {/* Ruta Perfil */}

        <Route path="perfil" element={<Perfil />} />

        {/* Ruta Hacer Reporte */}
        <Route path="hacer-reporte" element={<HacerReporte />} />

        {/* Ruta Mis Reportes */}
        <Route path="mis-reportes" element={<MisReportes />} />




        {/* Aquí agregas más módulos */}

      </Route>

    {/* RUTAS RECOLECTOR */}
      <Route
        path="/recolector"
        element={
          <ProtectedRouteRecolector element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /recolector) */}
        <Route index element={<HomeRecolector />} />

        {/* Ruta Solicitar Préstamo */}
        {/* <Route path="solicitar-prestamo" element={<SolicitarPrestamo />} /> */}


        {/* Aquí agregas más módulos */}

      </Route>

      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage404 />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
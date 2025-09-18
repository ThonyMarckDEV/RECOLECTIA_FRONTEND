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


// UIS Usuario
import HomeUsuario from './ui/usuario/home.jsx';
import HacerReporte from './ui/usuario/reportes/HacerReporte/Report.jsx';


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

        {/* Ruta Solicitar Préstamo */}
        {/* <Route path="solicitar-prestamo" element={<SolicitarPrestamo />} /> */}

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

        {/* Ruta Hacer Reporte */}
        <Route path="hacer-reporte" element={<HacerReporte />} />


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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, ChevronRightIcon } from '@heroicons/react/24/outline';
import jwtUtils from '../../utilities/jwtUtils';
import { logout } from '../../js/logout';
import logo from '../../assets/img/logo.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const refresh_token = jwtUtils.getRefreshTokenFromCookie();
  const rol = refresh_token ? jwtUtils.getUserRole(refresh_token) : null;

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate('/login');
  };

  const menus = {
    admin: [
      {
        section: 'Dashboard',
        icon: '📊',
        link: '/admin/dashboard',
      },
      {
        section: 'Users',
        icon: '👥',
        subs: [
          { name: 'List Users', link: '/admin/users/list' },
          { name: 'Add User', link: '/admin/users/add' },
        ],
      },
      {
        section: 'Settings',
        icon: '⚙️',
        subs: [
          { name: 'General', link: '/admin/settings/general' },
          { name: 'Security', link: '/admin/settings/security' },
        ],
      },
    ],
    usuario: [
      {
        section: 'Perfil',
        icon: '👤',
        link: '/usuario/perfil',
      },
      {
        section: 'Mapa',
        icon: '🗺️',
        link: '/usuario',
      },
      {
        section: 'Reportes',
        icon: '📝',
        subs: [
          { name: 'Hacer Reporte', link: '/usuario/hacer-reporte' },
          { name: 'Mis Reportes', link: '/usuario/mis-reportes' },
        ],
      },
    ],
    recolector: [
      {
        section: 'Mapa',
        icon: '🚛',
        link: '/recolector',
      },
    ],
  };

  const roleMenu = rol && menus[rol] ? menus[rol] : [];

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      {/* Botón de hamburguesa para móvil */}
      <button
        className="md:hidden fixed top-6 left-6 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bars3Icon className="h-5 w-5 text-gray-700" />
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-md border-r border-gray-100 transform transition-all duration-300 ease-out z-40 md:sticky md:top-0 md:h-screen md:translate-x-0 md:block ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Contenedor principal con flex para el layout */}
        <div className="flex flex-col h-full">
          {/* Header con logo */}
          <div className="flex-shrink-0 h-20 flex items-center justify-center px-6 border-b border-gray-50">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-lg font-semibold text-gray-900">
                RECOLECT<span className="text-green-600">IA</span>
              </span>
            </div>
          </div>

          {/* Menú de navegación - Crece para ocupar el espacio disponible */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="px-4 space-y-1">
              {roleMenu.map((item, index) => (
                <div key={index}>
                  {item.subs ? (
                    <>
                      <button
                        className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onClick={() => toggleSection(item.section)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.section}</span>
                        </div>
                        <ChevronRightIcon
                          className={`h-4 w-4 transform transition-transform duration-200 ${
                            openSections[item.section] ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {openSections[item.section] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subs.map((sub, subIndex) => (
                            <Link
                              key={subIndex}
                              to={sub.link}
                              className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                              onClick={() => setIsOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.link}
                      className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200 text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.section}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Botón de cerrar sesión - Fijado al final */}
          <div className="flex-shrink-0 p-4 border-t border-gray-50">
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cerrar sesión
                </h3>
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que quieres salir?
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
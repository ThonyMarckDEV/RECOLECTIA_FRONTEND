import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtUtils from '../../../utilities/jwtUtils';
import LoadingScreen from '../../../components/Shared/LoadingScreen';
import authService from './services/authService';
import loginimg from '../../../assets/img/login.jpg';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const result = await authService.googleLogin(credentialResponse.credential);
      
      const { access_token, refresh_token, idRefreshToken: refresh_token_id } = result;

      const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
      const refreshTokenExpiration = `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`;
      const refreshTokenIDExpiration = `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`;

      document.cookie = `access_token=${access_token}${accessTokenExpiration}`;
      document.cookie = `refresh_token=${refresh_token}${refreshTokenExpiration}`;
      document.cookie = `refresh_token_id=${refresh_token_id}${refreshTokenIDExpiration}`;

      const rol = jwtUtils.getUserRole(access_token);

      switch (rol) {
        case 'admin':
          toast.success('¡Login con Google exitoso!');
          setTimeout(() => navigate('/admin'), 1500);
          break;
        case 'usuario':
          toast.success('¡Login con Google exitoso!');
          setTimeout(() => navigate('/usuario'), 1500);
          break;
        case 'recolector':
          toast.success('¡Login con Google exitoso!');
          setTimeout(() => navigate('/recolector'), 1500);
          break;
        default:
          console.error('Rol no reconocido:', rol);
          toast.error(`Rol no reconocido: ${rol}`);
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      toast.error('Error al iniciar sesión con Google. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="265411714077-agc6ajcfsq3gu56982on32b52p7lbcir.apps.googleusercontent.com">
      <div className="relative min-h-screen w-full bg-gray-100 flex flex-col items-center justify-start p-4 overflow-hidden">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-8 mb-6 text-center">
          <span className="text-green-500">RECOLECT</span>
          <span className="text-white bg-green-600 px-2 rounded">IA</span>
        </h1>

        {/* Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg
            className="w-full h-32 sm:h-48 md:h-56 lg:h-80"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#16a34a"
              fillOpacity="1"
              d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,202,576,213.3C672,224,768,192,864,181.3C960,171,1056,181,1152,192C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <ToastContainer />
        {/* Main Content */}
        <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg flex flex-col lg:flex-row overflow-hidden relative z-10 mt-6 sm:mt-10 lg:mt-20">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 h-48 sm:h-64 lg:h-auto">
            <img
              src={loginimg}
              alt="Waste collection background"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Google Login Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center mt-12 sm:mt-16 lg:mt-20">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-600 mb-6 text-center">
              INICIA SESION
            </h3>

            {loading ? (
              <LoadingScreen />
            ) : (
              <div className="flex flex-col items-center w-full max-w-xs">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => {
                    toast.error('Error al iniciar sesión con Google');
                  }}
                  text="continue_with"
                  shape="rectangular"
                  theme="filled_black"
                  width="250"
                />
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Inicia sesión o regístrate con tu cuenta de Google
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
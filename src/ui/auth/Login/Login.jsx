import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtUtils from '../../../utilities/jwtUtils';
import LoadingScreen from '../../../components/Shared/LoadingScreen';
import LoginForm from './components/LoginForm';
import authService from './services/authService';
import loginimg from '../../../assets/img/login.jpg';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState(null); // 'google' or 'personal'
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const result = await authService.googleLogin(credentialResponse.credential);
      
      const { access_token, refresh_token, idRefreshToken: refresh_token_id } = result;

      const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
      const refreshTokenExpiration = rememberMe
        ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
        : '; path=/; Secure; SameSite=Strict';
      const refreshTokenIDExpiration = rememberMe
        ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
        : '; path=/; Secure; SameSite=Strict';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.login(username, password, rememberMe);

      const { access_token, refresh_token, idRefreshToken: refresh_token_id } = result;

      const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
      const refreshTokenExpiration = rememberMe
        ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
        : '; path=/; Secure; SameSite=Strict';
      const refreshTokenIDExpiration = rememberMe
        ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
        : '; path=/; Secure; SameSite=Strict';

      document.cookie = `access_token=${access_token}${accessTokenExpiration}`;
      document.cookie = `refresh_token=${refresh_token}${refreshTokenExpiration}`;
      document.cookie = `refresh_token_id=${refresh_token_id}${refreshTokenIDExpiration}`;

      const rol = jwtUtils.getUserRole(access_token);

      switch (rol) {
        case 'admin':
          toast.success('¡Login exitoso!');
          // Limpiar formulario
          setUsername('');
          setPassword('');
          setRememberMe(false);
          // Cerrar teclado
          if (usernameRef.current) usernameRef.current.blur();
          if (passwordRef.current) passwordRef.current.blur();
          // Restaurar posición de la pantalla
          window.scrollTo(0, 0);
          setTimeout(() => navigate('/admin'), 1500);
          break;
        case 'usuario':
          toast.success('¡Login exitoso!');
          setUsername('');
          setPassword('');
          setRememberMe(false);
          if (usernameRef.current) usernameRef.current.blur();
          if (passwordRef.current) passwordRef.current.blur();
          window.scrollTo(0, 0);
          setTimeout(() => navigate('/usuario'), 1500);
          break;
        case 'recolector':
          toast.success('¡Login exitoso!');
          setUsername('');
          setPassword('');
          setRememberMe(false);
          if (usernameRef.current) usernameRef.current.blur();
          if (passwordRef.current) passwordRef.current.blur();
          window.scrollTo(0, 0);
          setTimeout(() => navigate('/recolector'), 1500);
          break;
        default:
          console.error('Rol no reconocido:', rol);
          toast.error(`Rol no reconocido: ${rol}`);
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="265411714077-agc6ajcfsq3gu56982on32b52p7lbcir.apps.googleusercontent.com">
      <div className="relative min-h-screen w-full bg-gray-100 flex flex-col items-center justify-start p-4 overflow-hidden">
        {/* Loading Screen */}
        {loading && <LoadingScreen />}

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-8 mb-6 text-center animate-header">
          <span className="text-green-500">RECOLECT</span>
          <span className="text-white bg-green-600 px-2 rounded">IA</span>
        </h1>

        {/* Wave Background */}
        <div className="fixed bottom-0 left-0 right-0 z-0 animate-wave">
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

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          className="z-[9998]"
        />
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

          {/* Login Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-start mt-4 sm:mt-6 lg:mt-8">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-600 mb-6 text-center">
              INICIA SESIÓN
            </h3>

            <div className="flex flex-col items-center w-full max-w-xs space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                ¿Con qué deseas iniciar sesión?
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  onClick={() => setLoginMethod('google')}
                  className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loginMethod === 'google' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  aria-label="Iniciar sesión con Google"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12.24 10.667v2.833h4.396c-.177 1.093-.702 2.015-1.49 2.634l2.418 1.867c1.467-1.354 2.316-3.287 2.316-5.501 0-.682-.066-1.346-.19-1.983h-7.45z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 20c2.667 0 4.867-.867 6.49-2.333l-2.418-1.867c-.734.5-1.667.834-2.772.834-2.133 0-3.934-1.434-4.578-3.366H5.733v2.133C7.333 18.133 9.533 20 12 20z"
                      fill="#34A853"
                    />
                    <path
                      d="M7.422 13.667c-.167-.5-.267-1.033-.267-1.667s.1-1.167.267-1.667V8.2H5.733C5.2 9.333 5 10.6 5 12s.2 2.667.733 3.8h1.689z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 7.333c1.467 0 2.767.5 3.8 1.467l2.834-2.834C16.867 4.533 14.667 3.667 12 3.667c-2.667 0-4.867 1.867-6.467 4.533h1.689c.644-1.932 2.444-3.333 4.778-3.333z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => setLoginMethod('personal')}
                  className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loginMethod === 'personal' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  aria-label="Iniciar sesión con credenciales personales"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Personal
                </button>
              </div>
              <div className="w-full mt-6">
                {loginMethod === 'google' && (
                  <div className="animate-form">
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
                {loginMethod === 'personal' && (
                  <div>
                    <LoginForm
                      username={username}
                      setUsername={setUsername}
                      password={password}
                      setPassword={setPassword}
                      handleLogin={handleLogin}
                      rememberMe={rememberMe}
                      setRememberMe={setRememberMe}
                      usernameRef={usernameRef}
                      passwordRef={passwordRef}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes slideUp {
            0% {
              transform: translateY(100px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes fadeScale {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes waveSlide {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-form {
            animation: slideUp 0.8s ease-out forwards;
          }

          .animate-header {
            animation: fadeScale 0.8s ease-out forwards;
            animation-delay: 0.2s;
          }

          .animate-wave {
            animation: waveSlide 1s ease-out forwards;
          }
        `}
      </style>
    </GoogleOAuthProvider>
  );
};

export default Login;
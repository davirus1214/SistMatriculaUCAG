import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/reducers/authSlice';
import { RootState } from '../../redux/store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/Components/LoginAccStyle.css';
import ForgotPassword from './ForgotPassword';
import NotificationModal from '../Modal/NotificationModal';

const LoginAccountForm: React.FC = () => {
  // React-router-dom
  const navigate = useNavigate();

  // Local States
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);

  // Redux Hooks & Access
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const error = useSelector((state: RootState) => state.auth.error);
  const emailVerified = useSelector((state: RootState) => state.auth.emailVerified);
  //const states = useSelector((state: RootState) => state);
  //console.log(states, 'login')

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que se envíe la solicitud HTTP predeterminada
    setTimeout(() => {
      dispatch(login(email, password) as any); // Usa dispatch para llamar a la acción login
    }, 1000);

  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Redireccionar si está logueado, hay usuario y email verificado
  useEffect(() => {
    if (loggedIn && user && emailVerified) {
      // Mostrar el modal de éxito de inicio de sesión
      setShowLoginSuccessModal(true);
      const timeoutId = setTimeout(() => {
        setShowLoginSuccessModal(false); // Ocultar el modal después del tiempo especificado
        navigate("/home"); // Redirige al usuario a la página de inicio
      }, 3 * 1000); // Convierte los segundos a milisegundos

      // Limpia el temporizador si el componente se desmonta antes de que se complete
      return () => clearTimeout(timeoutId);
    }
  }, [loggedIn, user, emailVerified]);

  return (
    <>
      <div className="container">

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className='card shadow-lg'>
              {error && (
                <div className="alert-popup">
                  <div className="alert-message alert alert-danger">
                    <span>{error}</span>
                  </div>
                </div>
              )}
              {!user && (
                <form onSubmit={handleLogin}>
                  <div>
                    <img src="/src/assets/LogoUCAG.png" alt="Bootstrap" width="200" height="150" />
                    <h3>Bienvenido!</h3>
                    <h3>Inicio de Sesión</h3>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-start text-muted" >Correo:</label>
                    <input type="email" id="email" value={email} onChange={handleEmailChange} className="form-control" placeholder="Ej: correo@example.com" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-start text-muted">Contraseña:</label>
                    <div className="input-group">
                      <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={handlePasswordChange} className="form-control" placeholder="Ej: contraseña123" />
                      <button className="btn btn-outline-secondary" type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Utiliza los íconos de ojo visible/novisible */}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                  <div>
                    <br />
                    <label>¿No tiene cuenta?</label>
                    <Link to="/crear-cuenta">Crear Cuenta</Link>
                  </div>
                  <div>
                    <span>¿Olvidaste tu contraseña? </span>
                    <span className="link-style" onClick={() => setIsForgotPasswordModalOpen(true)} >Haz clic aquí</span>
                    <ForgotPassword isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} />
                  </div>
                </form>
              )}
              {user && (
                <div>
                  <div>
                    <img src="/src/assets/LogoUCAG.png" alt="Bootstrap" width="200" height="150" />
                    <h3>Bienvenido!</h3>
                  </div>
                  <label>Credenciales Correctas!</label>
                  <label>Hola {user.nombre}!</label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Componente del modal de éxito de inicio de sesión */}
      <NotificationModal
        texto="¡Inicio de sesión exitoso!"
        mostrar={showLoginSuccessModal}
        onConfirm={() => setShowLoginSuccessModal(false)}
        segundos={3} // Duración del modal en segundos
      />
    </>
  );

};

export default LoginAccountForm;

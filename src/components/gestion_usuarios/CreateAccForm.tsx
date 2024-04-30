import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { signup, signupFailure } from '../../redux/reducers/authSlice';
import { RootState } from '../../redux/store';
import '../../CSS/Components/CreateAccStyle.css';
import { Link } from 'react-router-dom';
import { fetchPaisInfoAsync, obtenerNombresCantonesDeProvincia, obtenerNombresDistritosDeCanton, obtenerNombresProvincias } from '../../redux/reducers/paisInfoSlice';
import { useAppDispatch } from '../../hooks/hooks';

interface FormData {
  nombre: string;
  correo: string;
  password: string;
  cedula: string;
  telefono: string;
  provincia: string | null;
  canton: string | null;
  distrito: string | null;
  direccion: string;
  fechaNacimiento: string;
  genero: string;
  // Otros campos si los hubiera
}
const initialState = {
  nombre: '',
  correo: '',
  password: '',
  cedula: '',
  telefono: '',
  provincia: '',
  canton: '',
  distrito: '',
  direccion: '',
  fechaNacimiento: '',
  genero: ''
};

const CreateAccountForm: React.FC = () => {

  // Estado para almacenar las provincias, cantones y distritos
  const [provincias, setProvincias] = useState<string[]>([]);
  const [cantones, setCantones] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);
  const [provincia, setSelectedProvincia] = useState<string>('')

  // Redux Hooks & Access
  const dispatch = useAppDispatch();
  const emailVerified = useSelector((state: RootState) => state.auth.emailVerified);
  const notification = useSelector((state: RootState) => state.auth.notification);
  const error = useSelector((state: RootState) => state.auth.error);
  const paisInfo = useSelector((state: RootState) => state.paisInfo.datosPais);
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState<FormData>(initialState);

  useEffect(() => {
    // Realiza la solicitud de la información del país al montar el componente
    dispatch(fetchPaisInfoAsync());
    if (paisInfo) {
      const provincias = obtenerNombresProvincias(paisInfo);
      setProvincias(provincias);
    }
  }, [paisInfo, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si el campo cambiado es un dropdown (select), actualiza el estado correspondiente y también el estado formData
    if (name === 'provincia') {
      setSelectedProvincia(value);
      const cantonesProvincia = obtenerNombresCantonesDeProvincia(value, paisInfo!);
      setCantones(cantonesProvincia);
      setDistritos([]); // Limpiar la selección de distrito
      setFormData({
        ...formData,
        [name]: value // Actualiza el valor de provincia en formData
      });
    } else if (name === 'canton') {
      setFormData({
        ...formData,
        [name]: value,
        distrito: '' // Limpiar la selección de distrito al cambiar el cantón
      });

      const distritosCanton = obtenerNombresDistritosDeCanton(paisInfo![provincia].cantones[value].distritos);
      setDistritos(distritosCanton);
    } else {
      // Si el campo cambiado no es un dropdown, actualiza solo el estado formData
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar si todos los campos están llenos
    const isFormFilled = Object.values(formData).every(value => value.trim() !== '');

    if (!isFormFilled) {
      dispatch(signupFailure('Porfavor llene todos los campos.'));
      //console.log(formData);
      return;
    }

    dispatch(signup(formData));
  };

  return (
    <div>
      <div className="container">
        <div>
          <img src="/src/assets/LogoUCAG.png" alt="Bootstrap" width="200" height="150" />
          {!user && !loggedIn && (
            <>
              <h2>Bienvenido!</h2>
              <h2>Crear Cuenta de Usuario </h2>
            </>
          )}

        </div>
        {!emailVerified && notification && (
          <div>
            <p>{notification}, Debes confirmar tu correo electrónico! </p>
          </div>
        )}

        {!notification && (
          <div className="card shadow-lg">
            <form onSubmit={handleSignUp} className="signup-form">
              {error && (
                <div className="alert-popup">
                  <div className="alert-message alert alert-danger">
                    <span>{error}</span>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="nombre">Nombre Completo:</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                    <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="provincia">Provincia:</label>
                    <select id="provincia" name="provincia" value={formData.provincia!} onChange={handleChange} className="form-control">
                      <option value="">Seleccione una provincia...</option>
                      {provincias.map((prov: string, index: number) => (
                        <option key={index} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="direccion">Dirección Exacta:</label>
                    <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className="form-control" placeholder="Ej: 123 Calle Principal, Barrio Los Ángeles" required />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="correo">Correo:</label>
                    <input type="correo" id="correo" name="correo" value={formData.correo} onChange={handleChange} className="form-control" placeholder="Ej: correo@example.com" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="form-control" placeholder="Ej: 8888-8888" pattern="\d*" title="Solo se permiten números." />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="canton">Cantón:</label>
                    <select id="canton" name="canton" value={formData.canton!} onChange={handleChange} className="form-control">
                      <option value="">Seleccione un cantón...</option>
                      {cantones.map((canton: string, index: number) => (
                        <option key={index} value={canton}>{canton}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="genero">Género:</label>
                    <select id="genero" name="genero" value={formData.genero} onChange={handleChange} className="form-control">
                      <option value="">Seleccione un género...</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Ej: contraseña123" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cedula">Cédula:</label>
                    <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} className="form-control" placeholder="Ej: 123456789" pattern="\d*" title="Solo se permiten números" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="distrito">Distrito:</label>
                    <select id="distrito" name="distrito" value={formData.distrito!} onChange={handleChange} className="form-control">
                      <option value="">Seleccione un distrito...</option>
                      {distritos.map((distrito: string, index: number) => (
                        <option key={index} value={distrito}>{distrito}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Crear Cuenta</button>
            </form>
          </div>
        )}
      </div>
      <br />
      {!user && !loggedIn && (
        <>
          <div>
            <label>¿Ya tiene cuenta?</label>
            <Link to="/iniciar-sesion">Iniciar Sesión</Link>
          </div>
        </>
      )}
    </div>
  );
};
export default CreateAccountForm;
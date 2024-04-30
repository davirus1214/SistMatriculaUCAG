import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserData, editarDoc } from '../../redux/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Components/MiPerfil.css'
import { obtenerNombresCantonesDeProvincia, obtenerNombresDistritosDeCanton, obtenerNombresProvincias } from '../../redux/reducers/paisInfoSlice';
import { useAppDispatch } from '../../hooks/hooks';
import NotificationModal from '../Modal/NotificationModal';
import { Timestamp } from 'firebase/firestore';

const generos = ['Masculino', 'Femenino', 'Otro']; // Ejemplo de opciones de género
const tiposUsuario = ['Común', 'Administrador'];
const labels: { [key: string]: string } = {
    correo: 'Correo Electrónico',
    cedula: 'Cédula',
    telefono: 'Teléfono',
    provincia: 'Provincia',
    canton: 'Cantón',
    distrito: 'Distrito',
    direccion: 'Dirección',
    fechaNacimiento: 'Fecha de Nacimiento',
    genero: 'Género',
    nombre: 'Nombre',
    user_type: 'Tipo de Usuario'
};

interface Props {
    pUsuario: UserData | null;
}

const MiPerfil: React.FC<Props> = ({ pUsuario }) => {
    // Redux Hooks & Access
    const dispatch = useAppDispatch()
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    let user: any = null
    if (!pUsuario) { // si hay un prop se trata de un usuario de la tabla y no mi perfil personal
        user = useSelector((state: RootState) => state.auth.user);
        //console.log(user);
    } else {
        user = pUsuario;
        //console.log(user);
    }
    //console.log(user);
    const paisInfo = useSelector((state: RootState) => state.paisInfo.datosPais);
    // Clonar el objeto user para evitar mutar el estado original -> recomendable cuando se edita
    const initialState: UserData = {
        nombre: user!.nombre! as string,
        correo: user?.correo! as string,
        cedula: user?.cedula! as string,
        telefono: user?.telefono! as string,
        provincia: user?.provincia! as string | null,
        canton: user?.canton! as string | null,
        distrito: user?.distrito! as string | null,
        direccion: user?.direccion! as string,
        fechaNacimiento: user?.fechaNacimiento! as string | null,
        genero: user?.genero! as string,
        user_type: user!.user_type as number,
    };

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<UserData>(initialState);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarFaltanDatosModal, setFaltanDatosModal] = useState(false);

    // Estado para almacenar las provincias, cantones y distritos
    const [provincias, setProvincias] = useState<string[]>([]);
    const [cantones, setCantones] = useState<string[]>([]);
    const [distritos, setDistritos] = useState<string[]>([]);
    const [provincia, setSelectedProvincia] = useState('')
    const [canton, setSelectedCanton] = useState('')
    const [distrito, setSelectedDistrito] = useState('');
    const [tipo, setSelectedTipo] = useState('');
    // React-router-dom
    const navigate = useNavigate();

    // Efecto para cargar las provincias cuando se carga la información del país
    // Efecto para inicializar el formulario cuando el usuario cambia
    useEffect(() => {
        if (!loggedIn && !user) {
            navigate("/");
        }

        // Verifica que user, paisInfo no sea undefined antes de continuar
        // Verifica que paisInfo[user.provincia] y paisInfo[user.provincia].cantones no sean undefined antes de continuar
        if (user && paisInfo) {
            const provincias = obtenerNombresProvincias(paisInfo);
            setProvincias(provincias);

            if (paisInfo[user.provincia!] && paisInfo[user.provincia!].cantones && paisInfo[user.provincia!].cantones[user.canton!].distritos) {
                const cantonesProvincia = obtenerNombresCantonesDeProvincia(user.provincia!, paisInfo!);
                setCantones(cantonesProvincia);
                const distritosCanton = obtenerNombresDistritosDeCanton(paisInfo[user.provincia!].cantones[user.canton!].distritos);
                //console.log(distritosCanton)
                setDistritos(distritosCanton);
            }
        }
    }, [user, paisInfo, navigate, obtenerNombresProvincias, obtenerNombresCantonesDeProvincia, obtenerNombresDistritosDeCanton]);

    const cargarCantones = (value: string, name: string) => {
        setSelectedProvincia(value);
        const cantonesProvincia = obtenerNombresCantonesDeProvincia(value, paisInfo!);
        setCantones(cantonesProvincia);
        setDistritos([]); // Limpiar la selección de distrito
        setFormData({
            ...formData!,
            [name]: value // Actualiza el valor de provincia en formData
        });
    }

    const cargarDistritos = (value: string, name: string) => {
        setSelectedCanton(value);
        //console.log(paisInfo![provincia].cantones[value].distritos)
        const distritosCanton = obtenerNombresDistritosDeCanton(paisInfo![provincia].cantones[value].distritos);
        //console.log(distritosCanton)
        setDistritos(distritosCanton);
        setFormData({
            ...formData!,
            [name]: value,
            distrito: '' // Limpiar la selección de distrito al cambiar el cantón
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        try {
            // Si el campo cambiado es un dropdown (select), actualiza el estado correspondiente y también el estado formData
            if (name === 'user_type') {
                //console.log(tiposUsuario[parseInt(value)]);
                setSelectedTipo(tiposUsuario[parseInt(value)]);
            }
            if (name === 'provincia') {
                cargarCantones(value, name);
            } else if (name === 'canton') {
                cargarDistritos(value, name)
            } else {
                // Si el campo cambiado no es un dropdown, actualiza solo el estado formData
                //console.log(value);
                setSelectedDistrito(value);
                setFormData({
                    ...formData!,
                    [name]: value
                });
            }
        } catch (error) {
            // Captura y maneja el error aquí
            //console.error('Error al acceder a las propiedades:', error);
            cargarCantones(user?.provincia!, name);
            cargarDistritos(value, name);
        }
        //console.log(canton)
    };

    const handleEditClick = () => {
        setEditMode(true);
        setFormData(initialState);
    };

    const handleCancelClick = () => {
        setEditMode(false);
        // Reiniciar el formulario con los datos originales del usuario
        if (user) {
            setFormData(initialState);
        }
    };
    // Función para abrir el modal de confirmación antes de guardar los cambios
    const handleSaveClick = () => {
        // Verificar si hay cambios en al menos un campo obligatorio
        const changesDetected = Object.keys(initialState).some(key => {
            // Excluir correo, estado y user_type de la comparación
            if (key === 'correo' || key === 'estado' || key === 'user_type') return false;
            return initialState[key as keyof UserData] !== formData[key as keyof UserData];
        });
    
        if (!changesDetected) {
            // No hay cambios, no se necesita mostrar el modal de que faltan datos
            setMostrarModal(true); // Mostrar el modal de confirmación directamente
            return;
        }
    
        // Verificar si algún campo obligatorio está vacío
        if (!formData?.cedula || !formData?.nombre || !formData?.canton || distrito === '') {
            setFaltanDatosModal(true);
            return;
        }
    
        // Validar formato de número de teléfono
        const numberPattern = /^[0-9]+$/;
        if ((formData.telefono && !numberPattern.test(formData.telefono)) || (formData.cedula && !numberPattern.test(formData.cedula))) {
            setFaltanDatosModal(true);
            return;
        }
    
        // Abre el modal de confirmación
        setMostrarModal(true);
    };
    
    const handleAceptar = () => {
        setFaltanDatosModal(false);
    }

    // Función para guardar los cambios después de confirmar en el modal
    const handleConfirmSave = () => {
        // Dispatch de la acción para actualizar los datos del usuario en Firebase Firestore
        dispatch(editarDoc(formData, formData.correo, pUsuario!));
        setEditMode(false);
        setMostrarModal(false); // Cierra el modal después de guardar
    };

    const handleCancelSave = () => {
        setMostrarModal(false); // Cierra el modal sin guardar los cambios
    };

    const mapUserTypeToText = (userType: number) => {
        return tiposUsuario[userType]; // tiposUsuario es el arreglo que contiene los valores de texto
    };

    return (
        <div className="container shadow-lg">
            <br />
            {!pUsuario && (
                <>
                    <h2>Mis Datos Personales</h2>
                </>
            )}
            {pUsuario && (
                <>
                    <h2>Datos de la Cuenta</h2>
                </>
            )}
            <br />
            <div className="row">
                {formData && Object.entries(formData).map(([key, value]) => {
                    if ((key === 'correo') || (key === 'estado')) {
                        return null; // Salta email, user_type y estado
                    } else if ((key === 'user_type') && !pUsuario) {
                        return null; // si no hay pUsuario se salta el renderizado del dropdown
                    }
                    // Renderizar el label con el texto personalizado
                    const label = labels[key] || key; // Usar el texto personalizado o el nombre del campo si no se encuentra en el objeto labels
                    if (key === 'fechaNacimiento') {
                        // Convertir fechaNacimiento a objeto Date si es un Timestamp
                        const fechaNacimiento: string = value instanceof Timestamp ? value.toDate().toDateString() : value.toString();
                        //console.log(value);
                        // Divide la fecha en partes (año, mes, día)
                        const parts = fechaNacimiento!.split('-');
                        // Reformatea la fecha en el formato deseado (día/mes/año)
                        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                        // Renderizar el selector de fecha para fecha de nacimiento
                        return (
                            <div key={key} className="col-md-3 mb-3">
                                <label className="form-label">{label}</label>
                                {!editMode ? (
                                    <div className="form-control">{formattedDate}</div>
                                ) : (
                                    <input
                                        title='fecha-nacimiento'
                                        type="date"
                                        name={key}
                                        value={value!} // value debe ser un string en formato 'yyyy-mm-dd'
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                )}
                            </div>
                        );
                    }

                    if (key === 'provincia' || key === 'canton' || key === 'distrito' || key === 'genero' || key === 'user_type') {
                        // Renderizar dropdowns para cantón, provincia, distrito y género
                        return (
                            <>
                                {pUsuario && ( // Verifica si pUsuario existe
                                    <div key={key} className="col-md-3 mb-3">
                                        <label className="form-label">{label}</label>
                                        {!editMode ? (
                                            <div className="form-control">{key === 'user_type' ? mapUserTypeToText(formData.user_type!) : value}</div>
                                        ) : (
                                            <select
                                                title='form-select'
                                                name={key}
                                                value={formData[key]!}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="">Seleccionar {label}</option>
                                                {key === 'provincia' && provincias.map((prov, index) => (
                                                    <option key={index} value={prov}>{prov}</option>
                                                ))}
                                                {key === 'canton' && cantones.map((canton, index) => (
                                                    <option key={index} value={canton}>{canton}</option>
                                                ))}
                                                {key === 'distrito' && distritos.map((distrito, index) => (
                                                    <option key={index} value={distrito}>{distrito}</option>
                                                ))}
                                                {key === 'genero' && generos.map((genero, index) => (
                                                    <option key={index} value={genero}>{genero}</option>
                                                ))}
                                                {key === 'user_type' && tiposUsuario.map((tipo, index) => (
                                                    <option key={index} value={index} selected={formData.user_type === index}>{tipo}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )}
                                {!pUsuario && ( // Verifica si pUsuario existe
                                    <div key={key} className="col-md-3 mb-3">
                                        <label className="form-label">{label}</label>
                                        {!editMode ? (
                                            <div className="form-control">{value}</div>
                                        ) : (
                                            <select
                                                title='form-select'
                                                name={key}
                                                value={formData[key]!}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="">Seleccionar {label}</option>
                                                {key === 'provincia' && provincias.map((prov, index) => (
                                                    <option key={index} value={prov}>{prov}</option>
                                                ))}
                                                {key === 'canton' && cantones.map((canton, index) => (
                                                    <option key={index} value={canton}>{canton}</option>
                                                ))}
                                                {key === 'distrito' && distritos.map((distrito, index) => (
                                                    <option key={index} value={distrito}>{distrito}</option>
                                                ))}
                                                {key === 'genero' && generos.map((genero, index) => (
                                                    <option key={index} value={genero}>{genero}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )}
                            </>
                        );
                    }

                    return (
                        <div key={key} className="col-md-3 mb-3">
                            <label className="form-label">{label}</label>
                            {!editMode ? (
                                <div className="form-control">{value}</div>
                            ) : (
                                <input
                                    title='contraseña'
                                    type='text'
                                    name={key}
                                    value={formData[key]!}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="button-container">
                {!editMode ? (
                    <button onClick={handleEditClick} className="btn btn-primary me-2">Editar</button>
                ) : (
                    <>
                        <button onClick={handleCancelClick} className="btn btn-secondary me-2">Cancelar</button>
                        <button onClick={handleSaveClick} className="btn btn-success">Guardar</button>
                    </>
                )}
            </div>
            {/* Modal de que faltan datos*/}
            <NotificationModal
                texto="Por favor, complete todos los campos obligatorios."
                mostrar={mostrarFaltanDatosModal}
                onConfirm={handleAceptar}
            />
            {/* Modal de confirmación para guardar */}
            <NotificationModal
                texto="¿Está seguro que desea guardar los cambios?"
                mostrar={mostrarModal}
                onClose={handleCancelSave}
                onConfirm={handleConfirmSave}
            />
            <br />
        </div>
    );



};

export default MiPerfil;
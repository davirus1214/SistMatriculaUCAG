import { Link, useNavigate } from 'react-router-dom';
import './CursosMain.css'
import { RootState } from "../../redux/store";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBook, FaGraduationCap, FaUserPlus } from 'react-icons/fa';

function CursosMain() {
    // LOGICA PARA REDIRECCIONAR SI NO SE ESTA LOGUEADO, PARA QUE NO SE PUEDA ACCEDER MENDIATE URL DIRECTA
    // React-router-dom
    const navigate = useNavigate();
    // Redux Hooks & Access
    const user = useSelector((state: RootState) => state.auth.user);
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    console.log('Conectado: ', loggedIn);
    // Redireccionar si está no logueado, y no hay usuario
    useEffect(() => {
        if (!loggedIn && !user) {
            navigate("/");
        }
    }, [loggedIn, user, navigate]);
    
    return (
        <>
            <h2>Gestión del Sistema de Matrícula</h2>
            <div >
                <div className="row">
                    <div className="col-md-6">
                        <Link to="/matriculaAdmin" className="card my-3 custom-card">
                            <div className="card-body">
                                <h5 className="card-title">Gestión de Matrícula</h5>
                                <p className="card-text text-secondary">Administre las solicitudes de matrícula.</p>
                                <FaUserPlus style={{ fontSize: '48px', color: "#4dd46d" }} />
                            </div>
                        </Link>

                        <Link to="/evaluacionEstudiantes" className="card my-3 custom-card">
                            <div className="card-body">
                                <h5 className="card-title">Gestión de Aprobaciones</h5>
                                <p className="card-text text-secondary">Apruebe o repruebe estudiantes en los cursos.</p>
                                <FaGraduationCap style={{ fontSize: '48px', color: "#4dd46d" }} />
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <Link to="/gestionar-cursos" className="card my-3 custom-card">
                            <div className="card-body">
                                <h5 className="card-title"> Gestión de Cursos</h5>
                                <p className="card-text text-secondary">Administre la oferta de cursos disponibles.</p>
                                <FaBook style={{ fontSize: '48px', color: "#4dd46d" }} />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CursosMain;

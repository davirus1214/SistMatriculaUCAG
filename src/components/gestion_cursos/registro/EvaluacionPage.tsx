import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect} from 'react';
import { ListaCursosAprobacionesPage } from "./";

export const EvaluacionPage = () => {
  // Acceso de usuario
  const user = useSelector((state: RootState) => state.auth.user);
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const navigate = useNavigate();

  // Necesario para redireccionar a / cuando el admin/usuario no se encuentra conectado
  useEffect(() => {  
    if(!loggedIn && !user){
        navigate('/');
    }
    
}, [loggedIn, user, navigate])
  
  return (
    <div>
      <h2 className = 'text-secondary mb-0 pt-3 ps-2'>Gestión de Aprobaciones de Estudiantes</h2>
      <ListaCursosAprobacionesPage />
    </div>
  )
}

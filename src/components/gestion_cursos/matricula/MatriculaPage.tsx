import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ListaCursosMatriculaPage } from "./";


export const MatriculaPage = () => {
    
    // Acceso de usuario
    const user = useSelector((state: RootState) => state.auth.user);
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    
    const navigate = useNavigate();


useEffect(() => {
    
    if(!loggedIn && !user){
        navigate('/');
    }
    
}, [loggedIn, user, navigate])
  

  return (
    <div>
        <h2 className="text-secondary mb-0 pt-3 ps-2 ">
            Gestión de Matrículas
        </h2>
        <ListaCursosMatriculaPage />
    </div>
    
  )
}

// Layout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { Footer, Navbar } from '.';
import { fetchEmpresaData } from '../redux/reducers/empresaSlice';
import { fetchPaisInfoAsync } from '../redux/reducers/paisInfoSlice';
import { useAppDispatch } from '../hooks/hooks';

interface LayoutProps {
  children: ReactNode;
}

// se utiliza este componente para que el footer y navbar estén presentes en c/u de los componentes sin inyectarlo en c/u
// lo que se renderiza en children son los demaś componentes unicamente

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Redux Hooks & Access
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Simulando una carga asíncrona
    setTimeout(() => {
      setIsLoaded(true);
    }, 1500); // Cambia este valor según tus necesidades de tiempo de carga

   
      // Realiza la solicitud de la información de la empresa
       dispatch(fetchEmpresaData());

      // Realiza la solicitud de la información del país al montar el componente
       dispatch(fetchPaisInfoAsync());
    
  }, [setTimeout, setIsLoaded]);

  return (
    <>
      <Navbar />
      {children}
      {/* {isLoaded && <Footer />} */}
    </>
  );
};

export default Layout;

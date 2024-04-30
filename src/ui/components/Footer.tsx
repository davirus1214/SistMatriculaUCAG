import './Footer.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ContactenosFooter } from './ContactenosFooter';


export const Footer = () => {

    
    // Redux Hooks & Access
    const empresaData = useSelector((state: RootState) => state.empresa.dataEmpresa);
    //console.log(state,'footer')
  return (

    <div className='footer-container'>
        <footer className='text-center text-lg-start bg-body-tertiary text-muted footer-ancho footer-container'>

            {/* Seccion: Redes Sociales */}
            <section className='d-flex justify-content-center justify-content-lg-between p-4 text-dark border-botton redes-estilo'>
                {/* Izquierda */}
                <div className='me-5 d-none d-lg-block'>
                    <span>Mantente conectado con nosotros por redes sociales</span>
                </div>
                {/* Izquierda */}

                {/* Derecha */}
                <div>
                    <a href={ empresaData?.facebookUrl } className='me-4 text-reset'>  
                    <img className= 'facebook' src="/src/assets/icono_facebook.svg" alt="Facebook" width="40" height="35" />
                        {/* <i className='fab fa-facebook-f facebook-color'> </i> */}
                    </a>
                </div>
                {/* Derecha */}
            </section>
            {/* Seccion: Redes Sociales */}

            <section className ="">
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        {/* Columna 1 */}
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className='text-uppercase fw-bold mb-4'>
                                <i className="fas fa-gem me-3"></i>{ empresaData?.titulo_footer }
                            </h6>
                            <p>
                                { empresaData?.subtitulo_footer }
                            </p>
                        </div>
                        {/* Columna 1 */}

                        {/* Columna 2 Horarios*/}
                        <div className='col-lg-3 col-md-6 mb-4'>
                            {/* Tabla */}
                            <h6 className="text-uppercase fw-bold mb-4">
                                Horario
                            </h6>

                            <p className="mb-1">
                                 { `Lunes: ${empresaData?.horarios[0]}` }
                            </p>
                            <p className="mb-1">
                                { `Martes: ${empresaData?.horarios[1]}` }
                            </p>
                            <p className="mb-1">
                                { `Miércoles: ${empresaData?.horarios[2]}` }
                            </p>
                            <p className="mb-1">
                                { `Jueves: ${empresaData?.horarios[3]}` }
                            </p>
                            <p className="mb-1">
                                { `Viernes: ${empresaData?.horarios[4]}` }
                            </p>
                            <p className="mb-1">
                                { `Sábado: ${empresaData?.horarios[5]}` }
                            </p>
                            <p className="mb-1">
                                { `Domingo: ${empresaData?.horarios[6]}` }
                            </p>
                        </div>
                        {/* Columna 2 Horarios*/}

                        {/* Columna 3 */}
                        <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4'>
                            {/* Links */}
                            <h6 className="text-uppercase fw-bold mb-4">
                                Contacto
                            </h6>
                            <p>
                                <i className='fas fa-home me-3'></i> { empresaData?.direccionCorta }
                            </p>
                            <p>
                                <i className='fas fa-envelope me-3'></i> { empresaData?.correo }
                            </p>
                            <p>
                                <i className='fas fa-phone me-3'></i> { empresaData?.telefonos[0] }
                            </p>
                            <p>
                                <i className='fa-brands fa-whatsapp me-3'></i> {empresaData?.telefonos[1]}
                            </p>
                            <ContactenosFooter />
                        </div>
                        {/* Fin Columna 4 */}
                    </div>
                    {/* Fin Fila 1 */}
                </div>
            </section>

            {/* Copyright */}
            <div className='copyright-estilo'>
            © 2024 Copyright:
                <a className='text-reset enlace-sin-subrayado fw-bold'>CANtonal.com</a> {/* { sitioweb } */}
            </div>
            {/* Copyright */}
        </footer>
        
    </div>
  )
}

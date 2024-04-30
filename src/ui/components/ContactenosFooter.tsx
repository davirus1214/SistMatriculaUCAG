import { useRef, useState } from 'react';
import { SentEmail, FormEmailLoggedIn, FormEmailNotLoggedIn } from '../../components';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

declare let bootstrap: any;

export const ContactenosFooter = () => {

    const form: any = useRef();
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

    const [mensajeExito, setMensajeExito] = useState('');

    
    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        //console.log('Formulario enviado');
        const enviadoExitoso = await SentEmail({ referenciaForm: form });
        
        if (enviadoExitoso){
            setMensajeExito('Su consulta ha sido enviada con éxito.'); // Mostrar la alerta después de enviar el formulario
            setTimeout(() => {
                setMensajeExito('');
                cleanForm();
                closeModal();
            }, 2000);
        }
    };

    const closeModal = () => {
        const modalElement = document.getElementById('ModalSentEmail');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

    const cleanForm = () => {
        form.current.reset();
    };

  return (
    <>
      {/*  <!-- Button para activar el modal --> */}
      <button type="button" className="btn btn-outline-primary btn-sm " data-bs-toggle="modal" data-bs-target="#ModalSentEmail">
        Contáctenos
      </button>

      {/* <!-- Modal --> */}
      <div className="modal fade" id="ModalSentEmail" tabIndex={-1} aria-labelledby="contactenosModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            
            {/* mensaje de exito o alerta van aqui */}
            {mensajeExito && (
            <div className="alert alert-success mt-2">{mensajeExito}</div>
          )}

            <div className="modal-content">
                {/* Header del modal */}
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="contactenosModalLabel"> Contáctenos</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                {/* Body del modal */}
                <div className="modal-body">
                    
                    {/* Form de las personas no logueadas */}
                    {!loggedIn && (
                        <FormEmailNotLoggedIn referenciaForm={form} onSubmit={handleFormSubmit}/>
                    )}

                    {/* Form de las personas logueadas */}
                    {loggedIn && (
                        <FormEmailLoggedIn referenciaForm={form} onSubmit={handleFormSubmit}/>
                    )}

                </div>

                {/* Footer del modal */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cleanForm}>Cerrar</button>
                    <button type="submit" className="btn btn-primary" form="modal-details">Enviar</button>
                </div>

            </div>

        </div>
        
      </div>
    </>
  )
}

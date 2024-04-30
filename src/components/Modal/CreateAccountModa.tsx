import React from "react";
import CreateAccountForm from "../gestion_usuarios/CreateAccForm";

interface ModalProps {
  mostrar: boolean;
  onClose: () => void;
  segundos?: number;
}

const CreateAccountModal: React.FC<ModalProps> = ({ mostrar, onClose }) => {
 
  return (
    <>
      {mostrar && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className={`modal d-block`} tabIndex={-1} style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg modal-xl"> {/* Añade la clase modal-lg para un modal de tamaño grande */}
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Usuario</h5>
                  {onClose && <button type="button" className="btn-close" onClick={onClose}></button>}
                </div>
                <div className="modal-body">
                  <CreateAccountForm />
                </div>
                <div className="modal-footer">
                  {onClose && <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateAccountModal;

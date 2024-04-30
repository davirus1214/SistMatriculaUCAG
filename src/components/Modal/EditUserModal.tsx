import React from "react";
import MiPerfil from "../gestion_usuarios/MiPerfil";
import { UserData } from "../../redux/reducers/authSlice";

interface ModalProps {
  mostrar: boolean;
  onClose: () => void;
  segundos?: number;
  usuario: UserData; // Definir el tipo de las props del usuario, puedes ajustarlo según la estructura de tus datos de usuario
}

const MiPerfilModal: React.FC<ModalProps> = ({ mostrar, onClose, usuario }) => {

  return (
    <>
      {mostrar && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className={`modal d-block`} tabIndex={-1} style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Perfil de Usuario a Editar:</h5>
                  {onClose && <button title="btn-close" type="button" className="btn-close" onClick={onClose}></button>}
                </div>
                <div className="modal-body">
                  {/* Pasar las props del usuario al componente MiPerfil */}
                  <MiPerfil pUsuario={usuario} />
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

export default MiPerfilModal;

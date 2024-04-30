import React, { useState } from "react";
import { enviarResetPassword } from "../../redux/reducers/authSlice";
import '../../CSS/Components/ForgotPassword.css';

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  const handleResetPass = () => {
    enviarResetPassword(email);
    onClose(); // Cierra el modal después de enviar el correo.
  };

  return (
    <>
      {isOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enviar Correo Electrónico para Cambiar Contraseña</h5>
                <button title="Cerrar" type="button" className="btn-close" onClick={onClose}/>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico:</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleResetPass}>Enviar Correo</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;

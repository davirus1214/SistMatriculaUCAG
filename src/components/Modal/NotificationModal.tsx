import React, { useEffect } from 'react';

interface ModalProps {
  texto: string;
  mostrar: boolean;
  onClose?: () => void; // Función opcional para cerrar el modal
  onConfirm?: () => void; // Función opcional para confirmar acción
  segundos?: number; // Propiedad opcional para especificar el tiempo de cierre automático en segundos
}

const NotificationModal: React.FC<ModalProps> = ({ texto, mostrar, onClose, onConfirm, segundos }) => {
  useEffect(() => {
    if (segundos) {
      const timeoutId = setTimeout(() => {
        onClose && onClose(); // Cierra el modal automáticamente después del tiempo especificado si la función está definida
      }, segundos * 1000); // Convierte los segundos a milisegundos
      return () => clearTimeout(timeoutId); // Limpia el temporizador si el componente se desmonta antes de que se complete
    }
  }, [segundos, onClose]);

  return (
    <div className={`modal ${mostrar ? 'show' : ''}`} style={{ display: mostrar ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Notificación</h5>
            {onClose && <button title="btn-close" type="button" className="btn-close" onClick={onClose}></button>} {/* Renderiza el botón de cierre solo si la función onClose está definida */}
          </div>
          <div className="modal-body">
            <p>{texto}</p>
          </div>
          <div className="modal-footer">
            {onClose && <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>} {/* Renderiza el botón de cancelar solo si la función onClose está definida */}
            {onConfirm && <button type="button" className="btn btn-primary" onClick={onConfirm}>Aceptar</button>} {/* Renderiza el botón de aceptar solo si la función onConfirm está definida */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

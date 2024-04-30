import { FaEye } from "react-icons/fa"
import { Curso } from "./curso.interface"
import { Timestamp } from "firebase/firestore"
import { obtenerNombreModalidad } from "../../redux/reducers/cursosSlice"

interface formProps{
    curso: Curso 
}

function DetallesCurso(props: formProps) {
 
  return (
    <>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#ver-${props.curso.id}`}>
          <FaEye />
        </button>
        <div className="modal fade" id={`ver-${props.curso.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">{`Información del Curso: ${props.curso.nombre}`}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-start">
              <div className="row">
                <div className="col" style={{ width: "50%", height: "auto" }}>
                  <img
                    src={props.curso.download_url}
                    alt="Imagen"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="col">
                  <p><strong>Nombre:</strong> {props.curso.nombre}</p>
                  <p><strong>Descripción:</strong> {props.curso.descripcion}</p>
                  <p><strong>Modalidad:</strong> {obtenerNombreModalidad(props.curso.modalidad)}</p>
                  <p><strong>Fecha de Inicio:</strong> {props.curso.fecha_inicio instanceof Timestamp ? props.curso.fecha_inicio.toDate().toLocaleDateString() : ''}</p>
                  <p><strong>Fecha de Fin:</strong> {props.curso.fecha_finalizacion instanceof Timestamp ? props.curso.fecha_finalizacion.toDate().toLocaleDateString() : ''}</p>
              {props.curso.link_plataforma && (
                <p>
                  <strong>Link del Curso:</strong>{" "}
                  <a href={props.curso.link_plataforma} target="_blank" rel="noopener noreferrer">
                    {props.curso.link_plataforma}
                  </a>
                </p>
              )}
              <p><strong>Horario:</strong></p>
              <ul>
                {props.curso.horario.map((horario, index) => (
                  <li key={index}>
                   {horario.dia}: {horario.hora}
                  </li>
                ))}
              </ul>
                </div>
                
              </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>

    </>
  )
}

export default DetallesCurso
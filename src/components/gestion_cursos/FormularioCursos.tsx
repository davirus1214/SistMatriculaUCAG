import { useState, ChangeEvent, useEffect} from 'react';
import { addFirebaseDoc } from "../../api/addFirebaseDoc/addFirebaseDoc";
import { updateFirebaseDoc } from '../../api/updateFirebaseDoc/updateFirebaseDoc';
import { Curso, Horario } from './curso.interface';
import './CursosMain.css'
import { uploadFirebaseImage } from '../../api/uploadFirebaseImage/uploadFirebaseImage';
import { Toast } from '../Toast/Toast';
import { MdDelete } from 'react-icons/md';
import { useAppDispatch } from '../../hooks/hooks';
import { addCurso, editCurso } from '../../redux/reducers/cursosSlice';
import { Timestamp } from 'firebase/firestore';
import NotificationModal from '../Modal/NotificationModal';
import { showToast } from '../Toast/toastMethods';

interface formProps{
    id: string
    titulo: string
    nombreButton: string | JSX.Element;
    styleButton: string
    submitButton: string
    curso: Curso | null
}

declare global {
    interface JQuery {
        modal(action: 'show' | 'hide' | 'toggle'): void;
    }
}

enum Modalidad {
    NoDefinida = -1,
    Presencial = 0,
    Virtual = 1,
    Mixta = 2
}

export const FormularioCursos = (props: formProps) => {
    const [nombreCurso, setNombreCurso] = useState('');
    const [descripcionCurso, setDescripcionCurso] = useState('');
    const [modalidad, setModalidad] = useState<number>(Modalidad.NoDefinida); 
    const [fechaInicio, setFechaInicio] = useState<Date | null >(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [linkCurso, setLinkCurso] = useState('');
    const [horarios, setHorarios] = useState<Horario[]>([{dia: '', hora: '' }]); // Lista de Horarios
    const [fileImage, setFileImage] = useState<File | null>(null); 
    const [intentadoEnviar, setIntentadoEnviar] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false); 
    const [mostrarFechaFin, setMostrarFechaFin] = useState(false); 
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (props.curso !== null) {
            setNombreCurso(props.curso.nombre);
            setDescripcionCurso(props.curso.descripcion);
            setModalidad(props.curso.modalidad);
            setFechaInicio(props.curso.fecha_inicio instanceof Timestamp ? props.curso.fecha_inicio.toDate() : null);
            setFechaFin(props.curso.fecha_finalizacion instanceof Timestamp ? props.curso.fecha_finalizacion.toDate() : null); 
            setLinkCurso(props.curso.link_plataforma);
            setHorarios(props.curso.horario);
            setMostrarFechaInicio(true);
            setMostrarFechaFin(true);
        }
    }, [props.curso]);

    const handleCancelarEdicion = () => {
        if (props.curso !== null) {
            setNombreCurso(props.curso.nombre);
            setDescripcionCurso(props.curso.descripcion);
            setModalidad(props.curso.modalidad);
            setFechaInicio(props.curso.fecha_inicio instanceof Timestamp ? props.curso.fecha_inicio.toDate() : null);
            setFechaFin(props.curso.fecha_finalizacion instanceof Timestamp ? props.curso.fecha_finalizacion.toDate() : null); 
            setLinkCurso(props.curso.link_plataforma);
            setHorarios(props.curso.horario);
            setMostrarFechaInicio(true);
            setMostrarFechaFin(true);
            setFileImage(null);
        }
    };
   
    const handleModalidadChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setModalidad(parseInt(e.target.value));
    };
  
    const handleNombreCursoChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNombreCurso(e.target.value);
    };
  
    const handleDescripcionCursoChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDescripcionCurso(e.target.value);
    };
  
    const handleLinkCursoChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLinkCurso(e.target.value);
    };
  
    const handleFechaInicioChange = (e: ChangeEvent<HTMLInputElement>) => {
      setMostrarFechaInicio(false);
      const fechaSeleccionada = e.target.value;
      setFechaInicio(new Date(fechaSeleccionada));
    };
    
    const handleFechaFinChange = (e: ChangeEvent<HTMLInputElement>) => {
      setMostrarFechaFin(false);
      const fechaSeleccionada = e.target.value;
      setFechaFin(new Date(fechaSeleccionada));
    };

    const diasOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const handleDiaChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newHorarios = horarios.map((horario, i) => {
            if (i === index) {
                return { ...horario, dia: event.target.value };
            }
            return horario;
        });
        setHorarios(newHorarios);
    };
    
    const handleHoraChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newHorarios = horarios.map((horario, i) => {
            if (i === index) {
                return { ...horario, hora: event.target.value };
            }
            return horario;
        });
        setHorarios(newHorarios);
    };

    const handleAddHorario = () => {
        setHorarios([...horarios, {dia: '', hora: '' }]);
    };

    const handleRemoveHorario = (index: number) => {
        if (horarios.length !== 1){
            const newHorarios = [...horarios];
            newHorarios.splice(index, 1);
            setHorarios(newHorarios);
        }
    };

    const handleReset = () => {
        setNombreCurso('');
        setDescripcionCurso('');
        setModalidad(Modalidad.NoDefinida);
        setFechaInicio(null);
        setFechaFin(null);
        setLinkCurso('');
        setFileImage(null);
        setIntentadoEnviar(false);
        setHorarios([{dia: '', hora: '' }]);
    };

    const handleCrearCurso = async() => {
      let res2: string | undefined;
      if(fileImage != null){
        res2 = await uploadFirebaseImage(fileImage!, `/Cursos/${nombreCurso}/image1`)
      }
      let cursoData : Curso = {
          nombre: nombreCurso,
          descripcion: descripcionCurso,
          modalidad: modalidad,
          fecha_inicio: Timestamp.fromDate(fechaInicio as Date),
          fecha_finalizacion: Timestamp.fromDate(fechaFin as Date),
          link_plataforma: linkCurso,
          horario: horarios,
          fechaCreacion: Timestamp.now(),
          image_url: `/Cursos/${nombreCurso}/image1`,
          aprobados: [],
          reprobados: [],
          matriculados: [],
          postulados: [],
          estado: 0,
          visible: 0,
          download_url: res2!,
      };
      console.log(cursoData)
      const res = await addFirebaseDoc('Cursos', cursoData);
      console.log(res)
      cursoData = {
        ...cursoData,
        id: res!.id
      }
      dispatch(addCurso(cursoData))
      $(`#${props.id}`).modal('hide');
      handleReset();
      // Limpiar el formulario y cerrar el modal después de unos segundos
      setTimeout(() => {
        showToast('toast-form-cursos-add');
      }, 1000); // El mensaje de éxito se mostrará durante 5 segundos (5000 milisegundos)
    };
 

    const handleEditarCurso = async () => {
        let res2: string | undefined;
        if(fileImage != null){
          res2 = await uploadFirebaseImage(fileImage!, `/Cursos/${nombreCurso}/image1`)
        } else {
            res2 = props.curso?.download_url;
        }
        if (props.curso !== null) {
            // Llamar a la función para actualizar el curso en Firebase
            let data: Curso = {
              nombre: nombreCurso,
              descripcion: descripcionCurso,
              modalidad: modalidad,
              fecha_inicio: Timestamp.fromDate(fechaInicio as Date),
              fecha_finalizacion: Timestamp.fromDate(fechaFin as Date),
              link_plataforma: linkCurso,
              horario: horarios,
              image_url: `/Cursos/${nombreCurso}/image1`,
              estado: 0,
              download_url: res2!,
            }
            await updateFirebaseDoc(`/Cursos/${props.curso.id}`, data);
            data = {
              ...data,
              id: props.curso.id
            }
            dispatch(editCurso(data))
            // Después de enviar los datos, mostrar el mensaje de éxito
            $(`#${props.id}`).modal('hide');
            setFileImage(null);
            setIntentadoEnviar(false);
            setMostrarModal(false);
            setTimeout(() => {
              showToast('toast-form-cursos-edit');
            }, 1000); // El mensaje de éxito se mostrará durante 5 segundos (5000 milisegundos)
        } 
    }

    const handleCancelSave = () => {
        setMostrarModal(false); // Cierra el modal sin guardar los cambios
    };

    const handleSubmit = () => {
        setIntentadoEnviar(true);
        if (
            nombreCurso === '' ||
            descripcionCurso === '' ||
            modalidad === Modalidad.NoDefinida ||
            fechaInicio === null ||
            fechaFin === null ||
            (props.id.startsWith('course-section-modal-add') && fileImage === undefined) || // La imagen es requerida solo al crear un curso
            (modalidad === Modalidad.Virtual || modalidad === Modalidad.Mixta) && linkCurso === '' ||
            (horarios.length > 0 && (horarios[horarios.length - 1].dia === "" || horarios[horarios.length - 1].hora === ""))
        ) {
            return; // Detener el envío del formulario si algún campo requerido está vacío
        }
        switch (true) {
            case props.id.startsWith('course-section-modal-add'):
                handleCrearCurso();
                break;
            case props.id.startsWith('course-section-modal-edit'):
                setMostrarModal(true);
                break;
            default:
                console.error('ID de modal no reconocido:', props.id);
        }
        setFileImage(null);
    };

    function formatearFecha(fecha: Date | undefined, mostrar: boolean): string | undefined {
        if (!mostrar && fecha){
            return fecha ? fecha.toISOString().substring(0, 10) : undefined;
        }
        else {
           if (fecha) {
                const fechaFormateada = fecha.toLocaleDateString()?.split('/');
                if (fechaFormateada) {
                    return fechaFormateada[2] + '-' + pad(fechaFormateada[1]) + '-' + pad(fechaFormateada[0]);
                }
            } 
        }
        return undefined;
    }

    function pad(num: string) {
        return num.length < 2 ? '0' + num : num;
    }

    return (
      <>
        <button type="button" className={props.styleButton}  data-bs-toggle="modal" data-bs-target={`#${props.id}`}>
            {props.nombreButton}
        </button>
        <div className="modal fade" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">{props.titulo}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.id.startsWith('course-section-modal-add') ? handleReset : handleCancelarEdicion}></button>
                    </div>
                    <div className="modal-body text-start">
                        <form id='form-modal-cursos'>
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="informacionHeading">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#informacionCollapse" aria-expanded="true" aria-controls="informacionCollapse">
                                        Información
                                        </button>
                                    </h2>
                                    <div id="informacionCollapse" className="accordion-collapse collapse" aria-labelledby="informacionHeading">
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col">
                                                <label className="form-label" htmlFor="nombre">
                                                    Nombre <span className="required-indicator text-danger">*</span>
                                                </label>
                                                <input type="text" className={`form-control ${intentadoEnviar && nombreCurso === '' ? 'is-invalid' : ''}`} id="nombre" name="nombre" value={nombreCurso} onChange={handleNombreCursoChange} placeholder="Nombre del curso" required />
                                                </div>
                                                <div className="col">
                                                    <label className="form-label" htmlFor="descripcion">
                                                        Descripción <span className="required-indicator text-danger">*</span>
                                                    </label>
                                                    <input type="text" className={`form-control ${intentadoEnviar && descripcionCurso === '' ? 'is-invalid' : ''}`} id="descripcion" name="descripcion" value={descripcionCurso} onChange={handleDescripcionCursoChange} placeholder="Descripción del curso" required/>
                                                </div>
                                                <div className="col">
                                                    <label className="form-label" htmlFor="modalidad">Modalidad <span className="required-indicator text-danger">*</span></label>
                                                    <select id="modalidad" className={`form-select ${intentadoEnviar && modalidad === Modalidad.NoDefinida ? 'is-invalid' : ''}`} name="modalidad" value={modalidad} onChange={handleModalidadChange} required>
                                                    <option disabled value={Modalidad.NoDefinida}>Selecciona una modalidad</option>
                                                    <option value={Modalidad.Presencial}>Presencial</option>
                                                    <option value={Modalidad.Virtual}>Virtual</option>
                                                    <option value={Modalidad.Mixta}>Mixta</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <label className="form-label"  htmlFor="fechaInicio">Fecha de Inicio <span className="required-indicator text-danger">*</span></label>
                                                    <input type="date" className={`form-control ${intentadoEnviar && fechaInicio === null ? 'is-invalid' : ''}`} id="fechaInicio" name="fechaInicio" value={fechaInicio ? formatearFecha(fechaInicio, mostrarFechaInicio) : ''} onChange={handleFechaInicioChange} required/>
                                                </div>
                                                <div className="col">
                                                    <label className="form-label" htmlFor="fechaFin">Fecha de Fin <span className="required-indicator text-danger">*</span></label>
                                                    <input type="date" className={`form-control ${intentadoEnviar && fechaFin === null ? 'is-invalid' : ''}`} id="fechaFin" name="fechaFin" value={fechaFin? formatearFecha(fechaFin, mostrarFechaFin) : ''} onChange={handleFechaFinChange} required/>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <label className="form-label" htmlFor="linkClase" >Link de Clase {modalidad === Modalidad.Virtual || modalidad === Modalidad.Mixta ? (<span className=" required-indicator text-danger">*</span>) : null}</label>
                                                    <input type="url" className={`form-control ${intentadoEnviar && (modalidad === Modalidad.Virtual || modalidad === Modalidad.Mixta) && linkCurso === '' ? 'is-invalid' : ''}`} id="linkClase" name="linkClase" value={linkCurso} onChange={handleLinkCursoChange} required={modalidad === Modalidad.Virtual || modalidad === Modalidad.Mixta}/>
                                                </div>
                                                <div className="col">
                                                    <label className="form-label" htmlFor="imagen">Imagen Ilustrativa  {props.id.startsWith('course-section-modal-add') ? (<span className="required-indicator text-danger">*</span>) : null} </label>
                                                    <input type="file" accept="image/png, image/jpeg, image/jpg" className={`form-control ${intentadoEnviar && props.id.startsWith('course-section-modal-add') && fileImage === null ? 'is-invalid' : ''}`} id="imagen" name="imagen" value={!fileImage ? "" : undefined}   onChange={ (event) => setFileImage(event.target.files![0])}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="horariosHeading">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#horariosCollapse" aria-expanded="false" aria-controls="horariosCollapse">
                                        Horarios <span className="required-indicator text-danger"> *</span>
                                        </button>
                                    </h2>
                                    <div id="horariosCollapse" className="accordion-collapse collapse" aria-labelledby="horariosHeading">
                                        <div className="accordion-body">
                                            <div>
                                                {horarios.map((horario, index) => (
                                                    <div key={index} className="input-group mb-3 has-validation">
                                                    <select value={horario.dia} className={`form-select input-group-text text-start ${intentadoEnviar && horario.dia === '' ? 'is-invalid' : ''}`} onChange={(event) => handleDiaChange(index, event)}>
                                                        <option value="">Seleccione un día</option>
                                                        {diasOptions.map((diaOption, i) => (
                                                        <option key={i} value={diaOption}>{diaOption}</option>
                                                        ))}
                                                    </select>
                                                    <input type="text" className={`form-control ${intentadoEnviar && horario.hora === '' ? 'is-invalid' : ''}`} value={horario.hora} onChange={(event) => handleHoraChange(index, event)} />
                                                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveHorario(index)}> <MdDelete/> </button>
                                                    </div>
                                                ))}
                                                 <div className='text-end'>
                                                <button type="button" className="btn btn-primary" onClick={handleAddHorario}>
                                                    Agregar Día
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.id.startsWith('course-section-modal-add') ? handleReset : handleCancelarEdicion}>Cancelar</button>
                        <button type="button" className="btn btn-primary"  onClick={handleSubmit}>{props.submitButton}</button>
                    </div>
                </div>
            </div>
        </div>
        {/* Modal de confirmación para guardar */}
        <NotificationModal
                texto="¿Está seguro que desea guardar los cambios?"
                mostrar={mostrarModal}
                onClose={handleCancelSave}
                onConfirm={handleEditarCurso}
            />

        
        <Toast 
        id='toast-form-cursos-add' 
        message={'Curso agregado con éxito!'} 
        title='Seccion de avisos'
        />
        <Toast 
        id='toast-form-cursos-edit' 
        message={'Curso editado con éxito!'} 
        title='Seccion de avisos'
        />
      </>
)}


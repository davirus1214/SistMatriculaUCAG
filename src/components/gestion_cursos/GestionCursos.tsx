import { useState, useEffect, ChangeEvent} from 'react';
import { FormularioCursos } from "./FormularioCursos";
import { Curso } from './curso.interface';
import EliminarCurso from './EliminarCurso';
import DataTableBase from '../dataTable/DataTableBase';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeCursoEstado, changeCursoVisible, cursosSelector, fetchCursos, obtenerNombreModalidad } from '../../redux/reducers/cursosSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { updateFirebaseDoc } from '../../api/updateFirebaseDoc/updateFirebaseDoc';
import DetallesCurso from './DetallesCurso';

enum Visible {
  NoVisible = 0, 
  Matricula = 1, 
  Proximamente = 2
}

function GestionCursos() {
  const [cursos, setCursos] = useState<Array<Curso>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [filterText, setFilterText] = useState("");
  const selectedCursos = useAppSelector(cursosSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(fetchCursos())
    })()
  }, [dispatch])

  useEffect(() => { 
    setLoading(selectedCursos.loading);
    setError(selectedCursos.error);
    if (!selectedCursos.loading && !selectedCursos.error) {
      setCursos(selectedCursos.cursos);
    }
  }, [selectedCursos]) 

  function handleSwitchToggleEstado(row: any): void {
    // Activar o desactivar el estado
    const nuevoEstado = row.estado === 0 ? 1 : 0; 
  
    updateFirebaseDoc(`/Cursos/${row.id}`, {
      estado: nuevoEstado,
    });
    dispatch(changeCursoEstado(row.id)); 
    const nuevoVisible = nuevoEstado === 0 ? Visible.NoVisible : row.estado;
    updateFirebaseDoc(`/Cursos/${row.id}`, {
      visible: parseInt(nuevoVisible),
    });
    dispatch(changeCursoVisible({ cursoId: row.id, visible: nuevoVisible })); 
  }

  function handleVisibleChange(e: ChangeEvent<HTMLSelectElement>, row: any, ) : void {
    updateFirebaseDoc(`/Cursos/${row.id}`, {
      visible: parseInt(e.target.value),
    });
    dispatch(changeCursoVisible({ cursoId: row.id, visible: parseInt(e.target.value) }));
  }

  const columns = [
    {
      name: "Nombre",
      selector: (row: any) => row.nombre,
      sortable: true,
    },
    {
      name: "Horario",
      cell: (row: any) => (
        <div className='text-start'>
          {row.horario.map((h: any, index: number) => (
          <div key={index}>
              {h.dia}: {h.hora}
          </div>
          ))}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Modalidad",
      selector: (row: any) => obtenerNombreModalidad(row.modalidad),
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: any) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={row.estado}
            onChange={() => handleSwitchToggleEstado(row)}
          ></input>
        </div>
      ),
      width: "5vw",
    },
    {
      name: "Visibilidad",
      cell: (row: any) => (
        <select id="visible" className={"form-select"} name="visible" value={row.visible} onChange={(e) => handleVisibleChange(e, row)} disabled={row.estado === 0} required>
          <option disabled value="">Selecciona donde será visible el curso</option>
          <option value={Visible.Matricula}>Sección de Matrícula</option>
          <option value={Visible.Proximamente}>Sección de Próximamente</option>
          <option value={Visible.NoVisible}>No visible</option>
        </select>
      ),
      width: "15vw",
    },
    {
      name: "Ver",
      cell: (row: any) => (
        <DetallesCurso curso={row}/>
      ),
      width: "5vw",
    },
    {
      name: "Editar",
      cell: (row: any) => (
        <FormularioCursos 
        id={`course-section-modal-edit-${row.id}`}
        titulo={`Editar Curso: ${row.nombre}`}
        nombreButton={<FaEdit />}
        styleButton={"btn btn-warning"}
        submitButton={"Guardar Cambios"}
        curso={row}
        />
      ),
      width: "5vw",
    },
    {
      name: "Eliminar",
      cell: (row: any) => (
        <EliminarCurso 
          id={row.id}
          image_url={row.image_url}
        />
      ),
      width: "6vw",
    },
  ];

  // LOGICA PARA REDIRECCIONAR SI NO SE ESTA LOGUEADO, PARA QUE NO SE PUEDA ACCEDER MENDIATE URL DIRECTA
  // React-router-dom
  const navigate = useNavigate();
  // Redux Hooks & Access
  const user = useSelector((state: RootState) => state.auth.user);
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  console.log('Conectado: ', loggedIn);
  // Redireccionar si está no logueado, y no hay usuario
  useEffect(() => {
    if (!loggedIn && !user) {
      navigate("/");
    }
  }, [loggedIn, user, navigate]);

  const goBack = () => {
    navigate("/Cursos")
  };


  return (
    <>
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-primary me-2" onClick={goBack}>
          <FaArrowLeft /> Volver
        </button>
      </div>
      <div style={{ top: "18%", left: "10%", right: "10%", bottom: "10%" }}>
        <h2 className="text-secondary mb-0 pt-3 ps-2">
          Gestión de Cursos
        </h2>
      </div>
      <div className="alert alert-info mt-3" role="alert">
        <strong>Nota:</strong> El <strong><em>Estado</em></strong> si se encuentra activado, se podrá seleccionar la <strong>Visibilidad</strong> del curso entre: <em>Sección de Matrícula, Sección de Próximamente y No Visible.</em> Si el <strong><em>Estado</em></strong> se encuentra inactivo la  <strong>Visibilidad </strong> del curso se encontrará <em>No Visible.</em>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex">
          <FormularioCursos
          id={"course-section-modal-add"}
          titulo={"Crear un Nuevo Curso"}
          nombreButton={"Crear un Nuevo Curso"}
          styleButton='btn btn-success py-0 ms-2 mt-3 shadow-lg'
          submitButton={"Crear Curso"}
          curso={null}
          />
        </div>
        <div className="col-3">
          <input
            type="text"
            className="form-control bg-light text-dark mt-3 me-2 border border-primary shadow-lg"
            placeholder="Filtrar por Nombre"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>
      <div>
          <DataTableBase columns={columns} data={cursos}></DataTableBase>
      </div>

    </>
  );
}

export default GestionCursos;

import { useState, useEffect } from 'react';
import DataTableBase from "../../dataTable/DataTableBase";
import { ListaUsuariosMatriculaPage } from '.';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { fetchCursos } from '../../../redux/reducers/cursosSlice';
import { Curso } from '../curso.interface';

export const ListaCursosMatriculaPage = () => {

    //REDUX/////////////////////////////////////////////////////
    // El dispatch lo necesito para lo de Redux con los cursos
    const dispatch = useAppDispatch();
    const coursesRedux = useSelector((state: RootState) => state.cursos.cursos);

    useEffect(() => {
        (async () => {
            await dispatch(fetchCursos())
        })()
    }, [dispatch])

    // console.log({coursesRedux});
    //REDUX///////////////////////////////////////////////////////

    //const [courses, setCourses] = useState<Course[]>([]);
    const [showUsuariosMatricula, setShowUsuariosMatricula] = useState(false);
    const [idCursoConsular, setIdCursoConsultar] = useState('');
    const [nombreCurso, setNombreCurso] = useState('');
    const [usuariosInteresadosCurso, setUsuariosInteresadosCurso] = useState<[]>([]);
    const [usuariosMatriculados, setUsuariosMatriculados] = useState<string[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Curso[]> ([]);
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();
    
    


    //Columnas de la tabla
    const columns = [
        {
            name: "Postulados",
            selector: (row: Curso) => row.postulados?.length || 0,
            sortable: true,
            width: "9vw",
        },
        {
            name: "Nombre",
            selector: (row: any) => row.nombre,
            sortable: true,
            width: "15vw",
        },

        // {
        //     name: "Descripción",
        //     selector: (row: any) => row.descripcion,
        //     sortable: true,
        //     width: "20vw",
        // },

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
            name: "Fecha Inicio",
            // selector: (row:any) => {
            //     if (row.fecha_inicio && typeof row.fecha_inicio.toDate === 'function') {
            //         return row.fecha_inicio.toDate().toLocaleDateString();
            //     } else {
            //         return "Cargando...";
            //     }
            // },

            selector: (row:any) => {
                if (row.fecha_inicio && typeof row.fecha_inicio.toDate === 'function') {
                    const fecha = row.fecha_inicio.toDate();
                    const dia = fecha.getDate();
                    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
                    const año = fecha.getFullYear();
                    return `${dia}/${mes}/${año}`;
                } else {
                    return "Cargando...";
                }
            },


            sortable: true,
            width: "10vw",
        },

        {
            name: "Fecha Fin",
            // selector: (row:any) => {
            //     if (row.fecha_finalizacion && typeof row.fecha_finalizacion.toDate === 'function') {
            //         return row.fecha_finalizacion.toDate().toLocaleDateString();
            //     } else {
            //         return "Cargando...";
            //     }
            // },
            selector: (row:any) => {
                if (row.fecha_finalizacion && typeof row.fecha_finalizacion.toDate === 'function') {
                    const fecha = row.fecha_finalizacion.toDate();
                    const dia = fecha.getDate();
                    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por eso sumamos 1
                    const año = fecha.getFullYear();
                    return `${dia}/${mes}/${año}`;
                } else {
                    return "Cargando...";
                }
            },
            sortable: true,
            width: "15vw",
        },

        {
            name: "Modalidad",
            selector: (row: any) => row.modalidad,
            cell: (row: any) => {
                let modalidadTexto = '';
                switch (row.modalidad) {
                    case 0:
                        modalidadTexto = 'Presencial';
                        break;
                    case 1:
                        modalidadTexto = 'Virtual';
                        break;
                    case 2:
                        modalidadTexto = 'Mixta';
                        break;
                    default:
                        modalidadTexto = 'Desconocida';
                }
                return modalidadTexto;
            },
            sortable: true,
            width: "15vw",
        },
    
        {
            name: "Gestionar",
            cell: (row: any) => (
                
                <button
                    className="btn btn-primary"
                    onClick={() => handleClickListaUsuarios(row.id, row.nombre, row.postulados, row.matriculados)}
                    >
                    <i className='fa-solid fa-users'></i>
                </button>
            ),
            width: "8vw",
        }
    ];

    const handleClickListaUsuarios = (idCurso: string, nombreCurso: string, usuariosInte: [], matriculadosCurso: string[]) => {   
        // console.log({matriculadosCurso});

        setUsuariosInteresadosCurso(usuariosInte);
        setIdCursoConsultar(idCurso);
        setNombreCurso(nombreCurso);
        setUsuariosMatriculados(matriculadosCurso);
        setShowUsuariosMatricula(true);
 

    }

    const handleRegresarClick = () => {
        setShowUsuariosMatricula(false); // Cambia el estado a true cuando se hace clic en Regresar
    }

    useEffect(() => {
        if (filterText.trim() === ''){
            setFilteredCourses(coursesRedux);
        } else {
            const filtered = coursesRedux.filter(course => 
                course.nombre.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [filterText, coursesRedux]);



    const regresarCursosPage = () => {
        navigate('/Cursos');
    }
  return (
    <div>

        {showUsuariosMatricula ? (
                <ListaUsuariosMatriculaPage onRegresarClick={handleRegresarClick} idCurso={idCursoConsular} 
                    nombreCurso = {nombreCurso} usuariosInteresados={usuariosInteresadosCurso}
                    matriculados = {usuariosMatriculados}/>
            ) : (
                <>
                    <h5 className="text-muted pt-4" >
                        Lista de Cursos
                    </h5>
                    <div className="d-flex justify-content-between">
                    <button className="btn btn-outline-primary mt-3 "
                                onClick={regresarCursosPage}><FaArrowLeft /> Volver</button>
                        <div className="col-md-2">

                            <input 
                                type="text"
                                className='form-control bg-light text-dark mt-3 me-2 border border-primary shadow-lg' 
                                placeholder='Filtrar por nombre'
                                value = {filterText}
                                onChange={e => setFilterText(e.target.value)}/>
                        </div>
                    </div>
                        <DataTableBase columns={columns} data={filteredCourses} />
                </>
            )}
         
    </div>
  )
}

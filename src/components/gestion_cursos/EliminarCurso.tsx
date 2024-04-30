import { MdDelete } from "react-icons/md"
import { deleteFirebaseDoc } from "../../api/deleteFirebaseDoc/deleteFirebaseDoc"
import { Modal } from "../../components/Modal/Modal"
import { idDelete } from "../../pages/About/about.interface"
import { useAppDispatch } from "../../hooks/hooks"
import { deleteFirebaseImages } from "../../api/deleteFirebaseImage/deleteFirebaseImage"
import { deleteCurso } from "../../redux/reducers/cursosSlice"
import { Toast } from "../Toast/Toast"
import { showToast } from "../Toast/toastMethods"

function EliminarCurso(prop: idDelete) {
    const dispatch = useAppDispatch()
    const handleDelete = async() =>{
        await deleteFirebaseDoc(`/Cursos/${prop.id}`)

        await deleteFirebaseImages(prop.image_url)
        dispatch(deleteCurso(prop))
        setTimeout(() => {
            showToast('delete-modal-curso')
        }, 1000); 
        
    }

    return (
    <>
        <Modal
        id={`course-section-modal-delete-${prop.id}`}
        buttonStyle={"btn btn-danger"}
        modalTitle="Notificación"
        buttonName={<MdDelete />}
        modalName={'Eliminar'}
        body={'¿Está seguro que desea eliminar este curso?'}
        secondaryButtonText={'Cancelar'}
        primaryButtonText={'Aceptar'}
        classSecondaryButton="btn btn-secondary"
        classPrimaryButton="btn btn-danger"
        functionButtonOption={() => {handleDelete()}} 
        />

        <Toast
            id='delete-modal-curso' 
            message='¡Curso eliminado con éxito!' 
            title='Seccion de avisos'
        />
    </>
    )
}

export default EliminarCurso
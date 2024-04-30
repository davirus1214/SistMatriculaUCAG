import { deleteFirebaseDoc } from '../../../api/deleteFirebaseDoc/deleteFirebaseDoc';
import { deleteFirebaseImages } from '../../../api/deleteFirebaseImage/deleteFirebaseImage';
import { Toast } from '../../../components/Toast/Toast';
import { showToast } from '../../../components/Toast/toastMethods';
import { useAppDispatch } from '../../../hooks/hooks';
import { deleteAds } from '../../../redux/reducers/adsSlice';
import { idDelete } from '../../About/about.interface';

export const AdsDelete = (props: idDelete) => {
  const dispatch = useAppDispatch()
    const handleDelete = async() =>{
        await deleteFirebaseDoc(`/Avisos/1x9cYIlY1FaQcw9jZhf6/Anuncios/${props!.id}`)        
        await deleteFirebaseImages(props.image_url)        
        dispatch(deleteAds(props))
        showToast('delete-modal-section')
    }
    
    return (
    <>
    <button type="button" className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target={`#ad-section-modal-delete${props.id}`}>
    Eliminar
    </button>

    <div className="modal fade" id={`ad-section-modal-delete${props.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Eliminar</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            ¿Estás seguro que desea eliminar está sección?
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss='modal' onClick={()=> handleDelete()}>Aceptar</button>
            </div>
            </div>
        </div>
    </div> 

    <Toast
    id='delete-modal-section' 
    message='¡Se ha eliminado con éxito el aviso!' 
    title='Seccion de avisos'
    />
    </>
  )
}

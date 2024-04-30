import { useState } from 'react'
import { adsSection } from '../about.interface';
import { updateFirebaseDoc } from '../../../api/updateFirebaseDoc/updateFirebaseDoc';
import { uploadFirebaseImage } from '../../../api/uploadFirebaseImage/uploadFirebaseImage';
import { useAppDispatch } from '../../../hooks/hooks';
import { editSection } from '../../../redux/reducers/aboutSlice';
import { showToast } from '../../../components/Toast/toastMethods';
import { Toast } from '../../../components/Toast/Toast';

export const AdsSectionEditModal = (props: adsSection) => {
    const [fileImage, setFileImage] = useState<File | undefined>(undefined)
    const initialState: adsSection = {
        id: props.id,
        posicion_id: props.posicion_id,
        titulo: props.titulo,
        subtitulo: props.subtitulo,
        descripcion: props.descripcion,
        estado: props.estado,
        image_url: props.image_url, 
        download_url: props.download_url
    }
    const [forms, setForms] = useState<adsSection>(initialState)
    

    const dispatch = useAppDispatch()
    const handleChange = (evt: any) => {
      setForms({
          ...forms,
          [evt.target.name]: evt.target.value
        })
    }
    const handleReset = () => {
        setForms(initialState)
    }
    const handleSetFile = (evt: any) =>{
        if(evt.target.files[0] != undefined){
            setFileImage(evt.target.files[0])
        }else{ setFileImage(undefined)}
      }
    const handleUpdate = async()=> {
        let res: string | undefined;
        if(fileImage != undefined){
            res = await uploadFirebaseImage(fileImage!,forms.image_url)
        }else{
            res = initialState.download_url
        }
        let data: adsSection = {                        
            posicion_id: forms.posicion_id,
            titulo: forms.titulo,
            subtitulo: forms.subtitulo,
            descripcion: forms.descripcion,
            estado: 1,
            image_url: forms.image_url,
            download_url: res!
        }
        await updateFirebaseDoc(`/Empresa/ZktZQqsBnqVVoL4dfRHv/secciones/${forms.id}`,data)
        data = {
            ...data,
            id: props.id
        }
        dispatch(editSection(data))
        showToast('edit-modal-section')
    }

    return (
    <>
    <button type="button" className="btn btn-outline-warning mb-1 btn-sm" data-bs-toggle="modal" data-bs-target={`#${props.id}`}>
        Editar
    </button>     
    <div className="modal fade" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
            <div className="modal-content">
                <div className="modal-header border-0">
                    <h1 className="modal-title fs-5 text-black" id={`title-modal-${props.id}`} >
                    Editar
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>handleReset()}></button>
                </div>
                <div className="modal-body">
                <div className='form-row text-black'>                      
                    <label className='form-label' htmlFor={`title-about-adsSection`}>Título</label>
                    <textarea className='form-control rounded-0 h-10' id={`title-about-${props.id}`} name="titulo" value={forms.titulo} onChange={(evt) => handleChange(evt)}/>
                    <label className='form-label' htmlFor={`subtitle-about-${props.id}`}>Subtítulo</label>
                    <textarea className='form-control rounded-0 h-10' id={`subtitle-about-${props.id}`} name="subtitulo" value={forms.subtitulo} onChange={(evt) => handleChange(evt)}/>
                    <label className='form-label' htmlFor={`description-about-${props.id}`}>Descripción</label>
                    <textarea className='form-control rounded-0 ' id={`description-about-${props.id}`} name='descripcion' value={forms.descripcion}  rows={10}  onChange={(evt) => handleChange(evt)}/>        
                    <label className='form-label' htmlFor={`uploadImage-${props.id}`}>Subir imagen</label>
                    <input className="form-control mb-3" id={`uploadImage-${props.id}`}  name='image_url' type="file" onChange={(evt)=>handleSetFile(evt)}/>    

                    <div className="btn-group" data-toggle="buttons">
                        <label className="btn btn-secondary">                        
                            <input type="radio" name="options" id="option1" autoComplete="off" onClick={() => setForms({...forms, posicion_id: 1})}/> Izquierda
                        </label>
                        <label className="btn btn-secondary">
                            <input type="radio" name="options" id="option2" autoComplete="off"  onClick={() => setForms({...forms, posicion_id: 2})}/> Derecha
                        </label>
                    </div>

                </div>

            </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>handleReset()}>Cancelar</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleUpdate()}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    </div>
    <Toast 
    id='edit-modal-section' 
    message='¡Se ha editado con éxito la sección!' 
    title='Seccion de avisos - Editar'
    />    
    </>
  )
}

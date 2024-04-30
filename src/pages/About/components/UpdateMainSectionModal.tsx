import { useState } from 'react';
import {  updateMainSection } from '../about.interface';
import { updateFirebaseDoc } from '../../../api/updateFirebaseDoc/updateFirebaseDoc';
import { uploadFirebaseImage } from '../../../api/uploadFirebaseImage/uploadFirebaseImage';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { aboutSelector,mainSection } from '../../../redux/reducers/aboutSlice';
import { Toast } from '../../../components/Toast/Toast';
import { showToast } from '../../../components/Toast/toastMethods';

export const UpdateMainSectionModal = () => {
  const about = useAppSelector(aboutSelector)
  const dispatch = useAppDispatch()
  const initialState = {   
    titulo: about.head.titulo_principal,
    subtitulo: about.head.subtitulo_principal
    
  }
  const [forms, setForms] = useState(initialState)
  
  const [imageUpload, setImageUpload] = useState<File>()

  const handleReset = () => {
    setForms(initialState)
  }

  const handleChange = (evt: any) => {
    setForms({
      ...forms,
      [evt.target.name]: evt.target.value
    })
  }

  const handleSetFile = (evt: any) =>{
    setImageUpload(evt.target.files[0])
    handleChange(evt)
  }
  
  
const handleUpdate = async () => {
    let res: string | undefined = about.head.download_url_principal
    if(imageUpload != undefined){
      res = await uploadFirebaseImage(imageUpload!,'/Empresa/Principal/imagen_principal')
    }
    const data: updateMainSection = {
      titulo_principal: forms.titulo,
      subtitulo_principal: forms.subtitulo,
      download_url_principal: res,
      image_principal_url: about.head.image_principal_url   
    }
  //update de la bd
  await updateFirebaseDoc('/Empresa/ZktZQqsBnqVVoL4dfRHv',data)
  //update del selector
  dispatch(mainSection(data))   
  showToast('toast-update')
}          
  return (
  <>


    <div className="text-center rounded mb-5">  
      <img src={about.head.download_url_principal} className="img-fluid" />      
      <h1 className="display-1 text-black">{about.head.titulo_principal}</h1>
      <h3 className="display-6 text-black">{about.head.subtitulo_principal}</h3>
      <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
        Actualizar Inicio
      </button>  
    </div>

    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header border-0">
              <h1 className="modal-title fs-5 text-black" id={`title-modal-add`} >
              Actualizar Inicio          
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleReset}></button>
          </div>
          <div className="modal-body">
            <div className='form-row text-black'>                      
              <label className='form-label' htmlFor={`title-about-add`}>Título</label>
              <textarea className='form-control rounded-0 h-10' id={`title-about-add`} name="titulo"   value={forms.titulo}  onChange={(evt)=> handleChange(evt)}/>
              <label className='form-label' htmlFor={`subtitle-about-add`}>Subtitulo</label>
              <textarea className='form-control rounded-0 ' id={`subtitle-about-add`} name='subtitulo' value={forms.subtitulo} onChange={(evt) => handleChange(evt)} />        
              <label className='form-label' htmlFor={`uploadImage-add`}>Subir imagen</label>
              <input className="form-control" id={`uploadImage-add`}  name='image_url' type="file" onChange={(evt)=> handleSetFile(evt)}/>                    
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleReset}>Cancelar</button>
            <button type="button" className="btn btn-primary"  data-bs-dismiss="modal" onClick={()=>handleUpdate()}>Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
    <Toast 
    id='toast-update' 
    message='¡Se ha actualizado con éxito la sección principal!' 
    title='Seccion Principal'
    />
  </>
  )
}


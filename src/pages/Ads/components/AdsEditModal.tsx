import { useState } from "react"
import { updateFirebaseDoc } from "../../../api/updateFirebaseDoc/updateFirebaseDoc"
import { Toast } from "../../../components/Toast/Toast"
import { showToast } from "../../../components/Toast/toastMethods"
import { ads } from "../ads.interface"
import { editAds } from "../../../redux/reducers/adsSlice"
import { uploadFirebaseImage } from "../../../api/uploadFirebaseImage/uploadFirebaseImage"
import { useAppDispatch } from "../../../hooks/hooks"
import { AdsLinkFieldModal } from "./AdsLinkFieldModal"

export const AdsEditModal = (props: ads) => {
  const dispatch = useAppDispatch()
  const [fileImage, setFileImage] = useState<File>()
  const initialState: ads = {
      id: props.id,
      posicion_id: props.posicion_id,
      titulo: props.titulo,
      subtitulo: props.subtitulo,
      descripcion: props.descripcion,
      estado: 1,
      image_url: props.image_url,
      download_url: props.download_url,
      links: props.links
  }
  const [forms, setForms] = useState<ads>(initialState)
  const handleChange = (evt: any) => {
    setForms({
          ...forms,
          [evt.target.name]: evt.target.value
      })
  }
  
  const handleReset = () => {
      //setLinks(props.links)
      setForms(initialState)
  }
  const handleSetFile = (evt: any) =>{
    if(evt.target.files[0] != undefined){
      setFileImage(evt.target.files[0])
  }else{ setFileImage(undefined)}
  }
  const handleDeleteLink = (index: number) => {
      const data = forms.links.filter((_element: any,i: any)=> {return index != i})
      const data1 = {...forms,links: data}
      setForms(data1)
      
  }
  const handleChangeLink = (evt: any,index: number) => {
      
      //let data = forms.links
      const data = forms.links.map((e:any,i: number)=>{if(i == index){return {...forms.links[i],[evt.target.name]:evt.target.value}}else{return e}})
      setForms({...forms,links: data})
  }
  const handleAddNewLink = () => {       
      const data = {...forms, links: [...forms.links,{titulo_link: '',link: ''}]}
      setForms(data)
  }
    
  const handleUpdate = async(evt: any)=> {
      evt.preventDefault()
      let res: string | undefined = forms.download_url
      if(fileImage != undefined){
          res = await uploadFirebaseImage(fileImage!,forms.image_url)
      }
      let data: any = {          
          posicion_id: forms.posicion_id,
          titulo: forms.titulo,
          subtitulo: forms.subtitulo,
          descripcion: forms.descripcion,
          estado: 1,
          image_url: forms.image_url,
          download_url: res!,
          links: forms.links
      }
      await updateFirebaseDoc(`/Avisos/1x9cYIlY1FaQcw9jZhf6/Anuncios/${props.id}`,data)
      data = {
        ...data, 
        id: props.id
      }
      dispatch(editAds(data))
      showToast('toast-edit-ads')
      handleReset()
  }

  
    return (
    <>
    <button type="button" className="btn btn-outline-warning mb-2" data-bs-toggle="modal" data-bs-target={`#edit-ads-${props.id}`}>
      Editar
    </button>    
    <div className="modal fade" id={`edit-ads-${props.id}`} data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
              <div className="modal-content">
                  <div className="modal-header border-0">
                      <h1 className="modal-title fs-5 text-black" id='title-modal-add' >
                      Editar Aviso
                      </h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  onClick={()=>handleReset()}></button>
                  </div>
                  <div className="modal-body">                                                                                   
                    <label className='form-label' htmlFor={`title-edit-ads-${props.id}`}>Título</label>
                    <textarea className='form-control rounded-0 h-10' id={`title-edit-ads-${props.id}`} name="titulo" value={forms.titulo} onChange={(evt) => handleChange(evt)}></textarea>
                    <label className='form-label' htmlFor={`subtitle-edit-ads`}>Subtítulo</label>
                    <textarea className='form-control rounded-0 h-10' id={`subtitle-edit-ads-${props.id}`} name="subtitulo"   value={forms.subtitulo} onChange={(evt) => handleChange(evt)}/>
                    <label className='form-label' htmlFor={`description-edit-ads`}>Descripción</label>
                    <textarea className='form-control rounded-0 ' id={`description-edit-ads-${props.id}`} name='descripcion' rows={5}  value={forms.descripcion} onChange={(evt) => handleChange(evt)}/>        
                    <div className="p-3 mb-3">
                        <div className="form-label">
                            <button type="button"  className='btn btn-outline-primary btn-sm mb-2' onClick={()=>handleAddNewLink()}>Agregar Nuevo Link</button>
                        </div>                        
                        {
                            forms.links != null &&
                            forms.links.map((element: any,index: number)=> {
                                return(
                                    <AdsLinkFieldModal
                                        key={`${element.titulo_link}-${index}`}
                                        titulo_link={element.titulo_link}
                                        link={element.link}
                                        index={index}
                                        f1={handleChangeLink}
                                        f2={handleDeleteLink}                                                
                                    />
                                )
                            })
                        }                                                                                                                                                                                                            
                        <label className='form-label' htmlFor={`uploadImage-edit-ads-${props.id}`}>Subir imagen</label>   
                        <input className="form-control mb-3" id={`uploadImage-edit-ads-${props.id}`}  name='image_url' type="file"   onChange={(evt) => handleSetFile(evt)}/>      
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
                      <button type="button" className="btn btn-secondary"  data-bs-dismiss="modal" onClick={()=>handleReset()}>Cancelar</button>
                      <button type="submit" className="btn btn-primary"  form='form-modal-edit-ads' data-bs-dismiss="modal" onClick={handleUpdate} >Guardar Cambios</button>
                  </div>
              </div>
          </div>
      </div>
    <Toast 
    id='toast-edit-ads' 
    message='¡Se ha editado con éxito el aviso!' 
    title='Seccion de avisos'
    />
    </>
  )
}

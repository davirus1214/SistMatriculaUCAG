import { useEffect, useState } from 'react'
import { closeModal } from '../../../components/Modal/modalMethods'
import { showToast } from '../../../components/Toast/toastMethods'
import { addFirebaseDoc } from '../../../api/addFirebaseDoc/addFirebaseDoc'
import { uploadFirebaseImage } from '../../../api/uploadFirebaseImage/uploadFirebaseImage'
import { v4 } from 'uuid'
import { useAppDispatch } from '../../../hooks/hooks'
import { Toast } from '../../../components/Toast/Toast'
import { addService } from '../../../redux/reducers/servicesSlice'
import { ServiceLinkFieldModal } from './ServiceLinkFieldModal'

export const ServiceAdd = () => {
    const dispatch = useAppDispatch()
    const [fileImage, setFileImage] = useState<File>()
    const initialState: any = {
        id: '',
        posicion_id: 1,
        titulo: '',
        subtitulo: '',
        descripcion: '',
        estado: 1,
        image_url: '',
        download_url: '',
        links: []
    }
    const [forms, setForms] = useState<any>(initialState)
    const [links,setLinks] = useState<any>([])
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
        setFileImage(evt.target.files[0])
        setForms({...forms, 
        image_url: `/Servicios/Lista_servicios/${v4()}`})
    }
    const handleDeleteLink = (index: number) => {
        const data = forms.links.filter((_element: any,i: any)=> {return index != i})
        const data1 = {...forms,links: data}
        setForms(data1)        
    }
    const handleChangeLink = (evt: any,index: any) => {
        const data = forms.links.map((e:any,i: number)=>{if(i == index){return {...forms.links[i],[evt.target.name]:evt.target.value}}else{return e}})
        setForms({...forms,links:data})
    }
    const handleAddNewLink = () => {       
        const data = {...forms, links: [...forms.links,{titulo_link: '',link: ''}]}
        setForms(data)
    }
      
    const handleAdd = async(evt: any)=> {
        evt.preventDefault()
        let res: string | undefined = ''
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
        const res2 = await addFirebaseDoc('/Servicios/xsc94XcgZ4Agn9IisLop/Lista_servicios',data)
        
        data = {
            ...data,
            id: res2!.id
        }
        dispatch(addService(data))
        setTimeout(()=>{    
        closeModal('add-service')
        showToast('toast-add-service')},500)
        handleReset()
    }
    useEffect(() => {
        setLinks(forms.links)
    }, [forms])
    
      return (
      <>
      <button type="button" className="btn btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#add-service">
        Crear Servicio
      </button>    
      <div className="modal fade" id="add-service" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h1 className="modal-title fs-5 text-black" id='title-modal-add' >
                        Crear Servicio
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  onClick={()=>handleReset()}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAdd} id='form-modal-add-service'>                                                              
                            <label className='form-label' htmlFor={`title-service-add`}>Título</label>
                            <textarea className='form-control rounded-0 h-10' id={`title-service-add`} name="titulo" value={forms.titulo} onChange={(evt) => handleChange(evt)}></textarea>
                            <label className='form-label' htmlFor={`subtitle-service-add`}>Subtítulo</label>
                            <textarea className='form-control rounded-0 h-10' id={`subtitle-service-add`} name="subtitulo"   value={forms.subtitulo} onChange={(evt) => handleChange(evt)}/>
                            <label className='form-label' htmlFor={`description-service-add`}>Descripción</label>
                            <textarea className='form-control rounded-0 ' id={`description-service-add`} name='descripcion' rows={5}  value={forms.descripcion} onChange={(evt) => handleChange(evt)}/>        
                            <div className="p-3 mb-3">
                                <div className="form-label">
                                    <button type="button"  className='btn btn-outline-primary btn-sm mb-2' onClick={()=>handleAddNewLink()}>Agregar Nuevo Link</button>
                                </div>
                                
                                {
                                    links != null &&
                                    links.map((element: any,index: number)=> {
                                        return(
                                            <ServiceLinkFieldModal
                                                key={`${element.titulo_link}-${index}-add`}
                                                titulo_link={element.titulo_link}
                                                link={element.link}
                                                index={index}
                                                f1={handleChangeLink}
                                                f2={handleDeleteLink}                                                
                                            />
                                        )
                                    })
                                }                                                                                                                                                                                                            
                                <label className='form-label' htmlFor={`uploadImage-add-service`}>Subir imagen</label>   
                                <input className="form-control mb-3" id={`uploadImage-add-service`}  name='image_url' type="file"   onChange={(evt) => handleSetFile(evt)} required/>      
                                <div className="btn-group" data-toggle="buttons">
                                    <label className="btn btn-secondary">                
                                        <input type="radio" name="options" id="option1" autoComplete="off" onClick={() => setForms({...forms, posicion_id: 1})}/> Izquierda
                                    </label>
                                    <label className="btn btn-secondary">
                                        <input type="radio" name="options" id="option2" autoComplete="off"  onClick={() => setForms({...forms, posicion_id: 2})}/> Derecha
                                    </label>  
                                </div>                            
                            </div>                    
                        </form>           
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"  data-bs-dismiss="modal" onClick={()=>handleReset()}>Cancelar</button>
                        <button type="submit" className="btn btn-primary"  form='form-modal-add-service' >Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
      <Toast 
      id='toast-add-service' 
      message='¡Se ha agregado con éxito el servicio!' 
      title='Seccion de servicios'
      />
      </>
    )
}

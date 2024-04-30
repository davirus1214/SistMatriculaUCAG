import { AdsSectionEditModal } from './AdsSectionEditModal';
import { AdsSectionDelete } from './AdsSectionDelete';
import { adsSection } from '../about.interface';
import { useAppSelector } from '../../../hooks/hooks';
import { aboutSelector } from '../../../redux/reducers/aboutSlice';
import { useEffect, useState } from 'react';

export const AdsSection = () => {    
    const about = useAppSelector(aboutSelector)    
    const [sections, setSections] = useState<adsSection[]>([])

    useEffect(() => { 
        setSections(about.sections)
    }, [about])

    
    return (
        
    <>   
    {about.loading &&  <div>Cargando...</div>}
    {        
        sections.map((element: adsSection)=>{        
            
            return ( 
                                 
                    element.posicion_id  == 1 ?(
                        <div key={`${element.id}-div1`} className="row mb-3 border">    
                        <div className="col">
                            <img  className='img-thumbnail' src={element.download_url}/>           
                        </div>            
                        <div className="col">                        
                            <h3>{element.titulo}</h3>
                            <h5>{element.subtitulo}</h5>
                            <p className='lead'>{element.descripcion}</p>
                        </div>         
                        <AdsSectionEditModal
                            key={`${element.id}-adssection1`} 
                            id = {element.id}
                            posicion_id={element.posicion_id}           
                            descripcion= {element.descripcion} 
                            estado= {element.estado} 
                            image_url= {element.image_url}
                            subtitulo= {element.subtitulo}
                            titulo= {element.titulo}
                            download_url={element!.download_url}                    
                        />     
                        <AdsSectionDelete
                            key={`${element.id}-delete1`}
                            id={element.id}
                            image_url={element.image_url}
                        />
                        </div>                 
                    )
                        
                        :
            
                    (    
                        <div key={`${element.id}-div2`} className="row mb-3 border">
                        <div className="col">                        
                            <h3>{element.titulo}</h3>
                            <h5>{element.subtitulo}</h5>
                            <p className='lead'>{element.descripcion}</p>
                        </div>
                        <div className="col">        
                            <img  className='img-thumbnail' src={element.download_url}/>
                        </div>
                        <AdsSectionEditModal                
                            key={`${element.id}-adssection2`} 
                            id = {element.id}
                            posicion_id={element.posicion_id}           
                            descripcion= {element.descripcion} 
                            estado= {element.estado} 
                            image_url= {element.image_url}
                            subtitulo= {element.subtitulo}
                            titulo= {element.titulo}
                            download_url={element.download_url}
                        />
                        <AdsSectionDelete 
                            key={`${element.id}-delete2`}
                            id={element.id}
                            image_url={element.image_url}
                        /> 
                        </div> 
                    )                                           
            )     
        })
    } 
    </>
    )
}

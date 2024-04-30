import { serviceDeleteLink } from "../service.interface"

export const ServiceLinkFieldModal = (props: serviceDeleteLink) => {
    return (
        <>
            <div className="input-group mb-1 p-1">
                <input type="text" id={`${props.titulo_link}-${props.index}1`} className="form-control" name='titulo_link'  placeholder='Titulo' value={props.titulo_link} onChange={(evt)=>props.f1!(evt, props.index)} autoFocus/>
                <input type="text" id={`${props.link}-${props.index}2`} className="form-control" name="link" aria-label="ads-link"  placeholder='www.cantonal.com'  value={props.link} onChange={(evt)=>props.f1!(evt, props.index)}/>
                <button type='button' className="fa-solid fa-trash-can" onClick={()=>props.f2!(props.index)}/>
            </div>
        </>
    )
}

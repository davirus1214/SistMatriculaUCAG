import { adsDeleteLink } from "../ads.interface"

export const AdsLinkFieldModal = (props: adsDeleteLink) => {

    return (
        <>
            <div className="input-group mb-1 p-1">
                <input type="text" className="form-control" name='titulo_link'  aria-label="ads-titulo-link" placeholder='Titulo' value={props.titulo_link} onChange={(evt)=>props.f1!(evt, props.index)} autoFocus/>
                <input type="text" className="form-control" name="link" aria-label="ads-link"  placeholder='www.cantonal.com'  value={props.link} onChange={(evt)=>props.f1!(evt, props.index)}/>
                <button type='button' className="fa-solid fa-trash-can" onClick={()=>props.f2!(props.index)}/>
            </div>
        </>
    )
}

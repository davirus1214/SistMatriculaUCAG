import { linkList } from "../service.interface"

export const ServiceLinkField = (props : linkList) => {    
    return (
    <> 
    {        
    props.link.map((element: any) => {
        return (
        <div key={element.titulo_link} className="text-sm-center">
            <a className="stretched-link" href={element.link} target="_blank">{element.titulo_link}</a>
        </div>
        )
    })
    } 
    </>
  )
}

export type serviceDeleteLink = {
    titulo_link: string,
    link: string,
    index : any,
    f1?: (evt: any, index:any) => void,
    f2?: (index: any) => void,

}

export type serviceMain = {
    estado: number,
    titulo: string,
    subtitulo: string,
    image_url: string,
    download_url: string    
}

export type service = {
    estado: number
    id: string,
    titulo: string,
    subtitulo: string,
    descripcion: string,
    posicion_id: number,
    image_url: string,
    download_url: string,
    links: Object[],    
}

export type linkList = {
    link: Object[]
}
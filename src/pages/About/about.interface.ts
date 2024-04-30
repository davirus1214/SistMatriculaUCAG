
export interface information{
  telefonos: number,
  correo: string,
  horarios: string[]
  direccion: string
}
  
export interface idDelete{
  id: string | undefined
  image_url: string
}

export interface updateMainSection{
  image_principal_url: string,
  subtitulo_principal: string,
  titulo_principal: string
  download_url_principal?: string;
}

export interface adsSection{
  id?: string
  posicion_id: number
  descripcion: string,
  estado: number,
  image_url: string,
  subtitulo: string,
  titulo: string
  download_url: string

}


export interface imageList{
  id: string
  image_url: string
  download_url: string
}
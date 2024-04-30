export interface Student{
    canton:          string;
    cedula:          string;
    correo:          string;
    direccion:       string;
    distrito:        string;
    estado:          number;
    fechaNacimiento: Date;
    genero:          string;
    nombre:          string;
    provincia:       string;
    telefono:        string;
    user_type:       number;
    [key: string]: string | number | Date;
}
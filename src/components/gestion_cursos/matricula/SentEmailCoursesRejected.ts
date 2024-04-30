import emailjs from '@emailjs/browser';


export const SentEmailCoursesRejected = (nombrePersona: string, correoPersona: string, nombreCurso: string): Promise<boolean> => {


    /*Email de Cantonal Matriculas*/
    const serviceId: string = 'service_dkr0wxb';
    const templateId: string = 'template_matricula_r'; // Rechazadas
    const publicKey: string = 'd2Zek1yZFLVAozcHY';
    /*Email de Cantonal MAtriculas*/
    const information = {
        user_email: correoPersona,
        user_name: nombrePersona,
        message: 'Si tiene dudas, contáctese con el equipo de la Unión Cantonal de Guatuso',
        nombre_curso: nombreCurso,
    };

    return new Promise((resolve, reject) => {

        emailjs
            .send(serviceId, templateId, information, publicKey,
            )
            .then(
                () => {
                    console.log('MSJ DE CORREO ENVIADO EXITOSAMENTE');
                    resolve(true);
                },
                (error) => {
                    console.log('FAILED... NO SE PUDO MANDAR EL MSJ DE CORREO', error.text);
                    reject(false);
                },
            );
    })
}

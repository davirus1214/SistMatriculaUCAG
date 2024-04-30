import emailjs from '@emailjs/browser';

export const SentEmail = ({referenciaForm}: {referenciaForm: any}) : Promise<boolean> => {

    // const serviceId: string  = 'service_ad6dvf4';
    // const templateId: string = 'contact_form';
    // const publicKey: string  = 'ON-22qKjZUDzY0s6N';
         /*Email de Cantonal*/
  const serviceId: string = 'service_8ymw9gn';
  const templateId: string = 'contact_form';
  const publicKey: string = 'Z5h6nUaQ9KoLIq2kN'; 
      /*Email de Cantonal*/
      

    return new Promise((resolve, reject) => {
        
        emailjs
            .sendForm(serviceId, templateId, referenciaForm.current, {
                publicKey: publicKey,
            })
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

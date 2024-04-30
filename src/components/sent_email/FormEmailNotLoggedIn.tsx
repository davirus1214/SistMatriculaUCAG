
export const FormEmailNotLoggedIn = ({referenciaForm, onSubmit}: {referenciaForm: any; onSubmit: any;}) => {
  return (
    <>
        <form ref={referenciaForm} id="modal-details" onSubmit={onSubmit}>
            <div className="mb-3">

                    <label htmlFor="nombre" className="col-form-label">Nombre:</label>
                    <input type="text" name="from_name" className="form-control" id="nombre" required />

                    <label htmlFor="correoUsuario" className="col-form-label" >Correo electrónico:</label>
                    <input type="email" name="user_email" className="form-control" id="correoUsuario" placeholder="Ej: usuario@email.com" required />

                    <label htmlFor="asunto" className="col-form-label">Asunto:</label>
                    <input type="text" name="subject" className="form-control" id="asunto" required />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="texto-consulta" className="col-form-label">Consulta:</label>
                    <textarea className="form-control" name="message" id="texto-consulta" required></textarea>
            </div>
        </form>
    </>
  )
}

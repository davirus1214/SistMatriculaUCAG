import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const FormEmailLoggedIn = ({referenciaForm, onSubmit}: {referenciaForm: any; onSubmit: any;}) => {
  
    const user = useSelector((state: RootState) => state.auth.user);

    return (
    <>
        <form ref={referenciaForm} id="modal-details" onSubmit={onSubmit}>
                    <div className="mb-3">

                    <label htmlFor="nombre" className="col-form-label">Nombre:</label>
                    <input type="text" name="from_name" className="form-control" id="nombre" value={user?.nombre} readOnly />

                    <label htmlFor="correoUsuario" className="col-form-label" >Correo electrónico:</label>
                    <input type="text" name="user_email" className="form-control" id="correoUsuario" value={user?.correo} readOnly />

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

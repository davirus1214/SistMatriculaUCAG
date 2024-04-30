import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { DragDrop } from '../../components/drag-drop_image/DragDrop';
import { updateFirebaseDoc } from '../../api/updateFirebaseDoc/updateFirebaseDoc';

export const HomePageEdit = ({ onClose, initialTitulo, initialDescription }: { onClose: () => void; initialTitulo: string; initialDescription: string; }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editImage, setEditImage] = useState(false);
    const [showEditImageBoton, setShowEditImageBoton] = useState(true);
    const [originalTitulo, setOriginalTitulo] = useState(''); 


    useEffect(() => {
        setOriginalTitulo(initialTitulo);
        setTitulo(initialTitulo);
        setDescripcion(initialDescription);
    }, [initialTitulo, initialDescription])

    const rutaDocumentoFirebase = 'Home/8Yl9xbZuRNFTUItTEKGU'
    

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'titulo') {
            setTitulo(value);
        } else if (name === 'descripcion') {
            setDescripcion(value);
        }

        
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        //firebase
        //
    };

    const handleEditClick = () => {
        setEditImage(true);
        setShowEditImageBoton(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        //
        //
        console.log(titulo, "TITULO");
        console.log(descripcion, "DESCRIPCION");
        const datosEditados = {
            titulo: titulo,
            descripcion: descripcion,
        };

        try{
            await updateFirebaseDoc(rutaDocumentoFirebase, datosEditados);
            console.log('Documento Home actualizado correctamente en Firebase.');
        } catch (error) {
            console.error('Error al actualizar el documento de Home en Firebase:', error);
        }


        onClose();
    };


    return (
        <>
            <div className='container mt-5'>
                
            <h1>Edición de la Página de Inicio:</h1>
            <div className="container mt-5">
                <form onSubmit={handleSubmit} className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="titulo">Titulo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="titulo"
                                name="titulo"
                                value={titulo}
                                onChange={handleInputChange}
                                placeholder="Agrega un título"
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion-edit" className='col-form-label'>Descripción</label>
                            <textarea
                                className="form-control"
                                id="descripcion-edit"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Agrega una descripción"
                                required
                                ></textarea>
                        </div>
                    </div>
                    
                    
                    
                    <div className="col-md-6 d-flex flex-column justify-content-between">
                        {/* Boton de editar la imagen */}
                        {showEditImageBoton &&
                            <div className='text-start mb-5'>
                                <button type="button" className='btn btn-success' onClick={handleEditClick}>Cambiar Imagen</button>
                            </div>
                        }
                        { editImage &&
                            <DragDrop />
                        }
                        
                       {/*  <div className='form-group'>
                            <label htmlFor="imagen">Insertar Imagen</label>
                            <input type="file" className='form-control-file' id='imagen' name='imagen' onChange={handleImageChange} />
                            </div>
                            <div className="btn-group mt-md-3">
                            <button type="submit" className="btn btn-primary">Aplicar</button>
                            <button type="button" className="btn btn-secondary">Guardar cambios</button>
                        </div> */}
                    </div>
                    <div className="container mt-5">
                        <button type="button" className='btn btn-secondary mr-2' style={{ marginRight: '50px' }} onClick={onClose}>Cerrar</button>
                        <button type="submit" className='btn btn-primary ml-2' >Guardar Cambios</button>
                    </div>
                </form>
            </div>
            </div>
        </>
    );
};

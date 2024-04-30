import { useRef, useState } from "react";
import './DragDrop.css'
import { uploadFirebaseImage } from "../../api/uploadFirebaseImage/uploadFirebaseImage";

interface ImageState {
    name: string;
    url: string;
}

export const DragDrop = () => {

    const [image, setImage] = useState<ImageState | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [imageUpload, setImageUpload] = useState<File | null >(null);

    function selectFile() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function onFileSelect(event:any){
        const file = event.target.files[0];
        //console.log(file);
        
        if(!file || file.type.split('/')[0] !== 'image') return;
        
        setImageUpload(file);
        setImage({
            name: file.name,
            url: URL.createObjectURL(file),
        });


    }

    function deleteImage(){
        if (image) {
            URL.revokeObjectURL(image.url);
            setImage(null);
            setImageUpload(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    function onDragOver(event:any){
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = "copy";
    }

    function onDragLeave(event:any){
        event.preventDefault();
        setIsDragging(false);
    }

    function onDrop(event:any){
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if(!file || file.type.split('/')[0] !== 'image') return;

        setImageUpload(file);
        setImage({
            name: file.name,
            url: URL.createObjectURL(file),
        });

        
    }


    async function uploadFile(file:any) {
        uploadFirebaseImage(file, 'Home/imagen-inicio');
    }

    async function uploadImage() {
        //console.log('Image: ', imageUpload);
        try{
            const result = await uploadFile(imageUpload);
            console.log(result);
            deleteImage();
        } catch(error){
            console.error(error);
        }   
    }

  return (
    <div className="dragDrop-component card">
            
    <div className="card">
            <div className="top">
                <p>Subir imagen</p>
            </div>
            { !image &&
            <div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                    <span className="select">
                        Suelte la imágen aquí
                    </span>

                ) : (
                    <>
                        Drag & Drop aquí o {" "}
                        <span className="select" role="button" onClick={selectFile}>
                            Adjunta la imagen
                        </span>
                    </>
                )}

                <input type="file" name="file" className="file" ref={fileInputRef} onChange={onFileSelect}></input>
            </div>
            }
            {image && (
                <div className="container">
                    <div className="image">
                        <span className="delete" onClick={deleteImage}>
                        <i className="fas fa-trash-alt"></i>  
                        </span>
                        <img src={image.url} alt={image.name}/>
                    </div>
                </div>
            )}
            {imageUpload && (
                <button type='button' className='btn btn-success' onClick={uploadImage}>
                    Subir
                </button>
            )}
        </div>
    </div>
  )
}

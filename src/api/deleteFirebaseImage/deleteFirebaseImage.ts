import { ref, deleteObject } from "firebase/storage";
import { firebase_storage } from "../../firebase";

export const deleteFirebaseImages = async (path: string) => {
    try{
        const docRef = ref(firebase_storage, path); 
        deleteObject(docRef)
        console.log('Imagen borrada', path)
    }catch(error:any){console.log(error)}


} 
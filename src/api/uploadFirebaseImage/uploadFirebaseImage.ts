import { firebase_storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadFirebaseImage = async (file: File, path: string) => {
    const storageRef = ref(firebase_storage, path)
    try{
        let downloadUrl = '';
        await uploadBytes(storageRef, file)
        .then((snap) => getDownloadURL(snap.ref).then((url)=> downloadUrl = url))
        console.log('Imagen subida',storageRef.fullPath)
        //devuelve el url de descarga
        return downloadUrl!
    }catch(error){console.log(error)};
    
}
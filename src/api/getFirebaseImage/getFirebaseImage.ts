import { getDownloadURL, ref } from "firebase/storage";
import { firebase_storage } from '../../firebase'

export const getFirebaseImage = async (path: string) => {
    try{
        const docRef = ref(firebase_storage, path)
        
        const res = await getDownloadURL(docRef).then((url)=> url)
        return res
    }catch(error:any){console.log(error)}

}
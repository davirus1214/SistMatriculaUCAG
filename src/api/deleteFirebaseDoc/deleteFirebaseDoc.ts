import { doc, deleteDoc } from "firebase/firestore";
import { data_base } from "../../firebase";

export const deleteFirebaseDoc = async (path: string) => {
    const docRef = doc(data_base, path);        
    await deleteDoc(docRef)
    console.log('Se borra el documento')

}

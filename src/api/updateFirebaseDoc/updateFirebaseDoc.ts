import { doc,updateDoc } from 'firebase/firestore'
import { data_base } from '../../firebase'
export const updateFirebaseDoc = async (path : string,data: any) => {
    //Se realiza la referencia al atributo que se quiere actualizar
    const docRef = doc(data_base,path)
    try{
        await updateDoc(docRef, data)
        console.log('Doc updated')
    }catch(error){console.log(error)}
}
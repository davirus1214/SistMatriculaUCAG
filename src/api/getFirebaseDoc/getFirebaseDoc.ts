import { doc, getDoc } from 'firebase/firestore'
import { data_base } from '../../firebase'

export const getFirebaseDoc = async (path: string) => {
    //Se realiza la referencia al atributo que se quiere leer
    try{
        const docRef = doc(data_base,path)
        const docSnap = await getDoc(docRef)
        return docSnap.data()
    }catch(error){console.log(error)} 
}
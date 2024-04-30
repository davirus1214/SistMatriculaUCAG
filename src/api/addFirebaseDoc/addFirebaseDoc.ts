import { collection, addDoc } from 'firebase/firestore';
import { data_base } from '../../firebase';

export const addFirebaseDoc = async (collectionPath: string, data: any) => {
    try {
        // Se obtiene la referencia a la colección
        const collectionRef = collection(data_base, collectionPath);
        
        // Se agrega un nuevo documento con los datos proporcionados
        const newDocRef = await addDoc(collectionRef, data);
        console.log('Nuevo documento agregado con ID:', newDocRef.id);

        return newDocRef
    } catch (error) {
        console.error('Error al agregar el nuevo documento:', error);
    }
};

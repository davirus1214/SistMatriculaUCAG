
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../store';
import { getFirebaseDocs } from "../../api/getFirebaseDocs/getFirebaseDocs";
import { collection, getDocs } from "firebase/firestore";
import { data_base } from "../../firebase";
import { RxCounterClockwiseClock } from "react-icons/rx";

export type EmpresaData = {
    correo: string;
    facebookUrl: string;
    titulo_footer:string;
    subtitulo_footer: string;
    direccionCorta: string;
    telefonos: string[]
    horarios: string[]
}

type EmpresaState = {
    dataEmpresa: EmpresaData | null;
}

const initialState: EmpresaState = {
    dataEmpresa: null,
};

const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
        setEmpresaData(state, action: PayloadAction<EmpresaData>){
            state.dataEmpresa = action.payload;
        },        
    },
});


export const fetchEmpresaData = (): AppThunk => async dispatch => {
    try{
        const docRef = await collection(data_base,'Empresa');
        const docs1 = await getDocs(docRef)
        // Obtener el primer documento en el QuerySnapshot
        const primerDocumento = docs1.docs[0];
        // Obtener los datos del documento
      const userData = primerDocumento.data()
        //console.log(userData)
        const docSnap = userData
        if(docSnap){
            const empresaData: EmpresaData = {
                correo: docSnap.correo,
                facebookUrl: docSnap.redes[0].red_url,
                titulo_footer: docSnap.titulo_principal,
                subtitulo_footer: docSnap.subtitulo_principal,
                direccionCorta: docSnap.direccion_corta,
                telefonos: [
                    docSnap.telefonos[0],
                    docSnap.telefonos[1]
                ],
                // telefonoFijo: docSnap.telefonos[0],
                // whatsapp: docSnap.telefonos[1],

                horarios: [                
                    docSnap.horarios[0],
                    docSnap.horarios[1],
                    docSnap.horarios[2],
                    docSnap.horarios[3],
                    docSnap.horarios[4],
                    docSnap.horarios[5],
                    docSnap.horarios[6]
                ]
                
            };
            dispatch(setEmpresaData(empresaData));
        }
    } catch (error){
        console.error("Error al obtener los datos de la empresa:", error);
    }
};
export const empresaSelector = (state: RootState) => state.empresa.dataEmpresa
export const { setEmpresaData } = empresaSlice.actions;
export default empresaSlice.reducer;
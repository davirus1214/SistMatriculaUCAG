import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { adsSection, updateMainSection, idDelete } from '../../pages/About/about.interface';
import { getFirebaseDoc } from '../../api/getFirebaseDoc/getFirebaseDoc';
import { getFirebaseDocs } from '../../api/getFirebaseDocs/getFirebaseDocs';

//THUNKS
export const fetchMainSection = createAsyncThunk(
    'about/fetchMainSection',
    async () => {
        const docSnap = await getFirebaseDoc('/Empresa/ZktZQqsBnqVVoL4dfRHv')
        const data: updateMainSection = {            
            image_principal_url: docSnap!.image_principal_url, 
            subtitulo_principal: docSnap!.subtitulo_principal, 
            titulo_principal: docSnap!.titulo_principal,
            download_url_principal: docSnap!.download_url_principal               
        }
        return data
    }
)

export const fetchSections = createAsyncThunk(
    'about/fetchSections',
    async () => {
        const docSnap = await getFirebaseDocs('/Empresa/ZktZQqsBnqVVoL4dfRHv/secciones')
        return docSnap as adsSection[]
    }
)

export interface aboutState{
    head: updateMainSection
    sections: adsSection[]
    error: string | undefined
    loading: boolean
}

const initialState: aboutState ={
    head: {
        image_principal_url: '', 
        subtitulo_principal: '', 
        titulo_principal: '',
        download_url_principal: ''
    },
    sections: [],
    loading: false,
    error: undefined
}

const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {
        mainSection(state,action: PayloadAction<updateMainSection>){
            state.head = action.payload
        },
        adsSections(state,action: PayloadAction<adsSection[]>){
            state.sections = action.payload
        },
        addSection(state, action: PayloadAction<adsSection>){
            state.sections = [...state.sections,action.payload]
        },
        editSection(state, action: PayloadAction<adsSection>){
            const data = state.sections.map( (element: adsSection) => { 
                if(element.id == action.payload.id){
                    return action.payload
                }  
                return element
            })
            state.sections = data
        },
        deleteSection(state, action: PayloadAction<idDelete>){
            const data = state.sections.filter((element)=> { 
                return element.id != action.payload.id })
            state.sections = data
        }
    },
    //AQUI SE IMPLEMENTAN LOS THUNKS ASINCRONOS
    extraReducers: (builder) => {
        
        builder.addCase(fetchMainSection.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchMainSection.fulfilled, (state,action: PayloadAction<updateMainSection>) => {
            state.loading = false,            
            state.head = action.payload               

        });
        builder.addCase(fetchMainSection.rejected, (state,action) => {
            state.loading = false
            state.head = {} as updateMainSection,
            state.error = action.error.message;            
        });
        
        builder.addCase(fetchSections.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchSections.fulfilled, (state,action: PayloadAction<adsSection[]>) => {
            state.loading = false,
            state.sections = action.payload
        });
        builder.addCase(fetchSections.rejected, (state,action) => {
            state.loading = false
            state.sections = [] as adsSection[],
            state.error = action.error.message;            
        });        
    }

});
export const aboutSelector = (state: RootState) => state.about
export const headAboutSelector = (state: RootState) => state.about.head
export const sectionsAboutSelector = (state: RootState) => state.about.sections
export const { mainSection,adsSections,addSection,editSection,deleteSection } = aboutSlice.actions;
export default aboutSlice.reducer;

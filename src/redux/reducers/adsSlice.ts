import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { idDelete } from '../../pages/About/about.interface';
import { getFirebaseDoc } from '../../api/getFirebaseDoc/getFirebaseDoc';
import { getFirebaseDocs } from '../../api/getFirebaseDocs/getFirebaseDocs';
import { ads, adsMain } from '../../pages/Ads/ads.interface';

interface adsState {
    loading: boolean,
    error: string | undefined,
    adsList: ads[],
    main: adsMain
}

//thunks
export const fetchMainAds = createAsyncThunk(
    'ads/fetchMainAds',
    async () => {
        
        const docSnap = await getFirebaseDoc('/Avisos/1x9cYIlY1FaQcw9jZhf6')
        return docSnap
    }
)

export const fetchAds = createAsyncThunk(
    'ads/fetchAds',
    async () => {        
        const docSnap = await getFirebaseDocs('/Avisos/1x9cYIlY1FaQcw9jZhf6/Anuncios')
        return docSnap
    }
)

const initialState: adsState = {
    loading: false,
    error: undefined,
    adsList: [],
    main:     {
        estado: 1,
        titulo: '',
        subtitulo: '',
        image_url: '',
        download_url: '' 
    }
}

const adsSlice =  createSlice({
    name: 'ads',
    initialState,
    reducers: {
        mainAds(state,action: PayloadAction<any>){
            state.main = action.payload
        },
        ads(state,action: PayloadAction<any[]>){
            state.adsList = action.payload
        },
        addAds(state, action: PayloadAction<any>){
            state.adsList = [...state.adsList,action.payload]
        },
        editAds(state, action: PayloadAction<any>){
            const data = state.adsList.map( (element: any) => { 
                if(element.id == action.payload.id){
                    return action.payload
                }  
                return element
            })
            state.adsList = data
        },
        deleteAds(state, action: PayloadAction<idDelete>){
            const data = state.adsList.filter((element)=> { 
                return element.id != action.payload.id })
            state.adsList = data
        }
    },
    extraReducers: (builder) => {
        
        builder.addCase(fetchMainAds.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchMainAds.fulfilled, (state,action: PayloadAction<any>) => {
            state.loading = false,            
            state.main = action.payload               

        });
        builder.addCase(fetchMainAds.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message;            
        });
    }
}
)

export const adsSelector = (state: RootState) => state.avisos
export const { mainAds,addAds,deleteAds,editAds } = adsSlice.actions;
export default adsSlice.reducer;
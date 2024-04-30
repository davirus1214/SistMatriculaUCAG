import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { idDelete } from '../../pages/About/about.interface';
import { getFirebaseDoc } from '../../api/getFirebaseDoc/getFirebaseDoc';
import { getFirebaseDocs } from '../../api/getFirebaseDocs/getFirebaseDocs';
import { service, serviceMain } from '../../pages/ServicesPage/service.interface';

interface ServiceState {
    loading: boolean,
    error: string | undefined,
    ServiceList: service[],
    main: serviceMain
}

//thunks
export const fetchMainService = createAsyncThunk(
    'Service/fetchMainService',
    async () => {
        
        const docSnap = await getFirebaseDoc('/Servicios/xsc94XcgZ4Agn9IisLop')
        return docSnap
    }
)

export const fetchService = createAsyncThunk(
    'Service/fetchService',
    async () => {        
        const docSnap = await getFirebaseDocs('/Servicios/xsc94XcgZ4Agn9IisLop/Lista_servicios')        
        return docSnap
    }
)

const initialState: ServiceState = {
    loading: false,
    error: undefined,
    ServiceList: [],
    main:     {
        estado: 1,
        titulo: '',
        subtitulo: '',
        image_url: '',
        download_url: '' 
    }
}

const serviceSlice =  createSlice({
    name: 'Service',
    initialState,
    reducers: {
        mainService(state,action: PayloadAction<any>){
            state.main = action.payload
        },
        Service(state,action: PayloadAction<any[]>){
            state.ServiceList = action.payload
        },
        addService(state, action: PayloadAction<any>){
            state.ServiceList = [...state.ServiceList,action.payload]
        },
        editService(state, action: PayloadAction<any>){
            const data = state.ServiceList.map( (element: any) => { 
                if(element.id == action.payload.id){
                    return action.payload
                }  
                return element
            })
            state.ServiceList = data
        },
        deleteService(state, action: PayloadAction<idDelete>){
            const data = state.ServiceList.filter((element)=> { 
                return element.id != action.payload.id })
            state.ServiceList = data
        }
    },
    extraReducers: (builder) => {
        
        builder.addCase(fetchMainService.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchMainService.fulfilled, (state,action: PayloadAction<any>) => {
            state.loading = false,            
            state.main = action.payload               

        });
        builder.addCase(fetchMainService.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message;            
        });
    }
}
)

export const ServiceSelector = (state: RootState) => state.servicios
export const { mainService,addService,deleteService,editService } = serviceSlice.actions;
export default serviceSlice.reducer;
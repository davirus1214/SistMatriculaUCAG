// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { auth_fire, data_base } from '../../firebase';
import { Timestamp, collection, addDoc, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

export interface UserData {
  [key: string]: string | number | null | undefined| Timestamp | any;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  provincia: string | null;
  canton: string | null;
  distrito: string | null;
  direccion: string;
  fechaNacimiento: string | Timestamp | null;
  genero: string;
  user_type?: number;
  estado?: number;
}

type AuthState = {
  notification: string | null;
  emailVerified: boolean;
  loggedIn: boolean;
  user: UserData | null;
  error: string | null;
}

const initialState: AuthState = {
  notification: null,
  emailVerified: false,
  loggedIn: false,
  user: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.loggedIn = true;
      state.user = action.payload;
      state.emailVerified = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loggedIn = false;
      state.user = null;
      state.error = action.payload;
    },
    signupSuccess: (state, action: PayloadAction<{ msg: string, emailVerified: boolean }>) => {
      state.notification = action.payload.msg;
      state.emailVerified = action.payload.emailVerified;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logOut: (state) => {
      state.loggedIn = false;
      state.user = null;
    },
    editInfo: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    }
  }
});


export const { loginSuccess, loginFailure, signupSuccess, signupFailure, logOut, editInfo } = authSlice.actions;
export default authSlice.reducer;

export const login = (email: string, password: string): AppThunk => async dispatch => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth_fire, email, password);

    // Verifica si el correo electrónico del usuario está verificado
    if (!userCredential.user.emailVerified) {
      throw new Error('Por favor, verifica tu dirección de correo electrónico antes de iniciar sesión.');
    }

    // Conseguir UserData si está verificado
    const usuarioObtenido: UserData | null = await obtenerUsuario(email);
    // Verificar si se obtuvo el usuario correctamente
    if (usuarioObtenido !== null) {
      // Hacer algo con el objeto de usuario obtenido
      console.log("Usuario obtenido:", usuarioObtenido);
    } else {
      console.log("No se pudo obtener el usuario.");
    }

    // Emitir orden de logueo de usuario satisfactorio
    dispatch(loginSuccess(usuarioObtenido!));
  } catch (error: any) {
    const msg = error.message.replace('Firebase: ', '');
    dispatch(loginFailure(msg));
  }
};

const obtenerUsuario = async (userEmail: string): Promise<UserData | null> => {
  // Referencia al documento del usuario en la colección 'Usuarios'
  const usuariosCollectionRef = collection(data_base, "Usuarios");

  try {
    // Query consulta para buscar documentos con el correo electrónico proporcionado
    const db_query = query(usuariosCollectionRef, where("correo", "==", userEmail));

    // Obtener el documento del usuario
    const usuarioDocSnap = await getDocs(db_query);
    // Obtener el primer documento en el QuerySnapshot
    const primerDocumento = usuarioDocSnap.docs[0];

    // Verificar si el documento existe
    if (primerDocumento) {
      // Obtener los datos del documento
      const userData = primerDocumento.data() as UserData;

      // Convertir fechaNacimiento a objeto Date si es un Timestamp
      const fechaNacimiento: string = userData.fechaNacimiento instanceof Timestamp ? userData.fechaNacimiento.toDate().toDateString() : userData.fechaNacimiento!.toString();
      //console.log(fechaNacimiento)

      // Construir un objeto UserData a partir de los datos obtenidos de DB FIREBASE
      const userDataObject: UserData = {
        nombre: userData.nombre,
        correo: userData.correo,
        cedula: userData.cedula,
        telefono: userData.telefono,
        provincia: userData.provincia,
        canton: userData.canton,
        distrito: userData.distrito,
        direccion: userData.direccion,
        fechaNacimiento: fechaNacimiento,
        genero: userData.genero,
        user_type: userData.user_type,
        estado: userData.estado
      };

      return userDataObject;
    } else {
      console.log("No se encontró el documento del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento del usuario: ", error);
    return null;
  }
}

export const signup = (formData: any): AppThunk => async dispatch => {
  try {
    //console.log(formData.correo)
    //console.log(formData.password)
    const userCredential = await createUserWithEmailAndPassword(auth_fire, formData.correo, formData.password);

    // Agrega el documento a fibrease(Usuarios) collection
    await agregarDoc(formData);

    // Envía el correo de verificación
    await sendEmailVerification(userCredential.user);

    const texto = 'Cuenta creada con éxito!'
    dispatch(signupSuccess({ msg: texto!, emailVerified: userCredential.user.emailVerified }));

  } catch (error: any) {
    //console.log(error.message)
    if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
      dispatch(signupFailure('El correo electrónico ya se encuentra en uso, inténte con otro porfavor.'));
    }
    else{
      dispatch(signupFailure('El correo electrónico está en un formato no permitido, revíselo porfavor.'));
    }

  }
};

const agregarDoc = async (formData: any) => {
  // Datos del nuevo documento
  const nuevoDocumento: UserData = {
    nombre: formData.nombre,
    correo: formData.correo,
    cedula: formData.cedula,
    telefono: formData.telefono,
    provincia: formData.provincia,
    canton: formData.canton,
    distrito: formData.distrito,
    direccion: formData.direccion,
    fechaNacimiento: Timestamp.fromDate(new Date(formData.fechaNacimiento)),
    genero: formData.genero,
    user_type: 0, // toda cuenta se crea con tipo ->   (0 : Comuún),
    estado: 0  // toda cuenta se crea con estado ->   (0 : Inactivo)
  };

  // Referencia a la coleccion de 'Usuarios'
  const users_collection_ref = collection(data_base, "Usuarios");

  // Agrega el nuevo documento a la colección 'Usuarios'
  try {
    //const documentoRef =
    await addDoc(users_collection_ref, nuevoDocumento);
    //console.log("Documento agregado con ID: ", documentoRef.id);
  } catch (error) {
    //console.error("Error al agregar documento: ", error);
  }
}

export const editarDoc = (formData: any, userEmail: string, user: UserData): AppThunk => async dispatch => {
  // Referencia a la colección de 'Usuarios'
  const usuariosCollectionRef = collection(data_base, "Usuarios");

  try {
    // Consulta para buscar documentos con el correo electrónico proporcionado
    const db_query = query(usuariosCollectionRef, where("correo", "==", userEmail));

    // Obtener el documento del usuario
    const usuarioDocSnap = await getDocs(db_query);

    // Verificar si se encontró el documento
    if (!usuarioDocSnap.empty) {
      // Obtener la referencia al documento del usuario
      const primerDocumento = usuarioDocSnap.docs[0];
      const userDocRef = doc(data_base, "Usuarios", primerDocumento.id);

      // Actualizar los datos del documento con los datos proporcionados en formData
      await setDoc(userDocRef, formData);

      const user_data_updated = await obtenerUsuario(userEmail);

      if (!user){
        dispatch(editInfo(user_data_updated!));
      } else {
        // no hace nada si es un pUsuario para no alterar el persistant user redux
      }

      //console.log("Documento del usuario actualizado exitosamente");
    } else {
      //console.log("No se encontró el documento del usuario");
    }
  } catch (error) {
    //console.error("Error al actualizar el documento del usuario: ", error);
  }
};

export const enviarResetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth_fire, email);
    alert('Se ha enviado un correo electrónico para restablecer tu contraseña.');
  } catch (error) {
    //console.log(error);
  }
};
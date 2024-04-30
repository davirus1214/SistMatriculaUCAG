import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'; // Importa Provider desde react-redux
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import App from './App.tsx';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)

import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router/AppRouter.tsx';
import Layout from './ui/layout.tsx';
import './App.css'

function App() {
  
  // Dentro del componente Router<Layout> se encapsula se pasa como children AppRouter, 
  // LAyout posee por defecto header/navbar y footer
  return (
    <Router>
      <Layout>
        <AppRouter />
      </Layout>
    </Router>
  )
}

export default App

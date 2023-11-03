import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './routes/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'
import UserPage from './routes/UserPage.jsx'
import CorralonesPage from './routes/CorralonesPage.jsx'
import RegistersPage from './routes/RegistersPage.jsx'
import TrazadoPage from './routes/TrazadoPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={<App />}>
                  <Route path='/' element={<HomePage/> } />
                  <Route path='Usuarios' element={<UserPage/> } />
                  <Route path='Corralones' element={<CorralonesPage/> } />
                  <Route path='Registros' element={<RegistersPage/> } />
                  <Route path='Trazado-Rutas' element={<TrazadoPage/>} />
            </Route> 
          </Routes> 
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)

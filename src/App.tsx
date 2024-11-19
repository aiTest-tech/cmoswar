import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          {/* <Route path='/login' element={<LoginPage />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

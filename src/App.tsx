import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Forgotpassword from './pages/Forgotpassword'
import ResetPassword from './pages/ResetPassword'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/forgot-password' element={<Forgotpassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

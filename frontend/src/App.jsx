
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLayout from './components/auth/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/register'

function App() {

  return (
    <Routes>
      <Route path='/' element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

    </Routes>
  
  )
}

export default App

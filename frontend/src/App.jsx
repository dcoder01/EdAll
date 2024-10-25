
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import AuthLayout from './components/auth/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/register'
import Home from './pages/Home'
import CheckAuth from './components/common/checkAuth';
import NotFound from './pages/notFound/index';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { checkAuth } from './store/authSlice';
import HeaderHome from './components/common/HeaderHome';
import HeaderClass from './components/common/HeaderClass.jsx';




function App() {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
//dispatch on-->page reload
const location = useLocation();
const onHomeScreen=location.pathname.startsWith('/home')
const onClassScreen = location.pathname.startsWith("/enter");

  return (
    <div className='app'>
    <>{onHomeScreen? <HeaderHome/>: onClassScreen && <HeaderClass />}  </>
      <Routes>
        <Route path='/auth' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ><AuthLayout /></CheckAuth>
        }>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path='/home' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ><Home /></CheckAuth>
        }></Route>
        <Route path='/' element={<Navigate  to={'/home'}/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <ToastContainer />
   
    </div>

  )
}

export default App


import { Route, Routes } from 'react-router-dom'
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

function App() {
  // const { user, isAuthenticated, isLoading } = useSelector(
  //   (state) => state.auth
  // )
  // console.log(isAuthenticated);
  // console.log(user);
  
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(CheckAuth())
  // }, [dispatch])
  // if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;
  const isAuthenticated=false
  const user=null
  return (
    <>
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
        <Route path='/' element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ><Home /></CheckAuth>
        }></Route>
        <Route path='*' element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>

  )
}

export default App

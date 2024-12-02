
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
import EnterClass from './pages/class/EnterClass'
import ViewPeople from './pages/class/ViewPeople';
import { Loader } from "lucide-react";
import ClassWork from './pages/class/ClassWork';
import CreateQuiz from './pages/quiz/CreateQuiz';
import CreateAssignment from './pages/assignment/CreateAssignment';


function App() {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { user, isLoading } = useSelector(state => state.auth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  //dispatch on-->page reload
  const location = useLocation();
  const onHomeScreen = location.pathname.startsWith('/home')
  const onClassScreen = location.pathname.startsWith("/enter");
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className='app'>
      <>{onHomeScreen ? <HeaderHome /> : onClassScreen && <HeaderClass />}  </>
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


        {/* class feed */}
        <Route path='/enter/class/:classId'
          element={<CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ><EnterClass />
          </CheckAuth>} />

        {/* //view users */}
        <Route path='/enter/class/:classId/people' element={<CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
        ><ViewPeople />
        </CheckAuth>} />


        <Route path='/enter/class/:classId/classwork' element={<CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
        ><ClassWork />
        </CheckAuth>} />



        <Route path='/enter/class/:classId/classwork/create-quiz' element={<CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
        ><CreateQuiz />
        </CheckAuth>} />

        {/* route for assignment creation */}
        <Route path='/enter/class/:classId/classwork/create-assignment' element={<CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
        ><CreateAssignment/>
        </CheckAuth>} />








        <Route path='/' element={<Navigate to={'/home'} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <ToastContainer />

    </div>

  )
}

export default App

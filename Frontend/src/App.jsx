import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

    useEffect(()=>{
     const fetchUser = async () => {
       try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/current-user`, {
          withCredentials: true,
        });
        dispatch(login(res.data.user));
       } catch (error) {
        dispatch(logout());
       } finally {
        setLoading(false);
       }
     }

     fetchUser();
    }, [])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
         <Outlet />
         <ToastContainer />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App

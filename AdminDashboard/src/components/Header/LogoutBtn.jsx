import React from 'react'
import {useDispatch} from 'react-redux'
import axios from 'axios'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        const res = axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`);
        
        dispatch(logout());
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
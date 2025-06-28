import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
      const backendUrl = useSelector(state => state.auth.backendUrl);
  

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(logout());
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/api/auth/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ send token
            },
            withCredentials: true, // ✅ in case cookies are used for refresh
          }
        );

        // ✅ login expects { user, accessToken }
        dispatch(
          login({
            user: res.data.data,
            accessToken: token,
          })
        );
      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
          <ToastContainer />
        </main>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;

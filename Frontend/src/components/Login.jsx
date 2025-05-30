import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const backendUrl = useSelector(state => state.auth.backendUrl);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");

    // const login = async (data) => {
    //     setError("");

    //     try {
    //         const res = await fetch('/api/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(data)
    //         });

    //         const result = await res.json();

    //         if (!res.ok) {
    //             throw new Error(result.message || 'Login failed');
    //         }

    //         dispatch(authLogin(result.user));
    //         navigate('/');
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // };

    const login = async (data) => {
        setError("");
        axios.defaults.withCredentials = true;
        try {
            const res = await axios.post(`${backendUrl}/api/auth/login`, data);
            dispatch(authLogin(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-400 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <Logo width="80px" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mt-4">Welcome Back</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(login)} className="space-y-6">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Invalid email address"
                            }
                        })}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required"
                        })}
                        error={errors.password?.message}
                    />

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-lg font-medium transition duration-200">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;

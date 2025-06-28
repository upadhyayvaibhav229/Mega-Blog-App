import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const create = async (data) => {
    setError("");
    // console.log("Submitted data", data);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        data
      );
      // console.log(res);
      dispatch(login(res.data.data));
      console.log("User data:", res.data);

      navigate("/");
    } catch (error) {
      console.log(error.response?.data); // debug info
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("fullName", {
                required: "Name is required",
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be valid",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

import React from 'react'
import CommonForm from "../../components/common/Form";

import { loginFormControls } from "../../config";
import { login } from "../../store/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const initialState={
  email:"",
  password:"",
}
const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  function onSubmit(e){
    e.preventDefault();
    dispatch(login(formData)).then((data)=>{
      if (data?.payload?.success) {
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        toast.error(data?.payload || "Login failed! Try again.");
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
      Sign in to your account
      </h1>
      <p className="mt-2">
      Don't have an account
        <Link
          className="font-medium ml-2 text-primary hover:underline"
          to="/auth/register"
        >
          Signup
        </Link>
      </p>
    </div>
    <CommonForm
      formControls={loginFormControls}
      buttonText={"Login"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
    />
  </div>
  )
}

export default Login
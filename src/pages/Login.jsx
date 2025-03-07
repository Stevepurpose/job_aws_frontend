import React from 'react'
import { useState } from "react";
import backendUrl from "../Back";
import { useNavigate, NavLink } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "../components/LoadingIndicator";
import '../App.css'


const Login = () => {
  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();

      try {
          const res = await backendUrl.post("/api/token/" , { username, password })
             // console.log(res.data)
          if(res.data.access && res.data.refresh){
              localStorage.setItem(ACCESS_TOKEN, res.data.access);
              localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
              navigate("/") //to home
          }
          else{
            console.error('invalid token response:', res.data)
          }

            }
           catch (error) {
            alert(error)
           // console.error('Login error:', error)
           //   if(error.response){
            //    console.error('Response Status:', error.response.status)
            //  }
            // else if(error.request){
             // console.error('Request data:', error.request) 
             //}
            //  else{
             //   console.error('Error message:', error.message)
             // }
             }

           finally {
              setLoading(false)
          }
        }
  return (
    
<div>
<form onSubmit={handleSubmit} className="form-container">
            <h1>Login Form</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                Login
            </button>
        </form>
       
<p> Don't have an account?  <NavLink to="/signup/register">Sign up</NavLink> </p>

     
   </div> 
    
  )
}

export default Login

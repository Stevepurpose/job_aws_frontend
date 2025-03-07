import React from 'react'
import {Outlet, NavLink, useLocation } from 'react-router-dom'

const Signup = () => {

    const location = useLocation()

  return (
    <div>
        {location.pathname ==='/signup' && (
            <>
       <h1>Job Search Tracker</h1>
        <p> Click sign in below to continue</p>

     

     <NavLink to="/signup/login">Sign in</NavLink>

    <p> Don't have an account?  <NavLink to="/signup/register">Sign up</NavLink> </p>
    </>
        )}
    <Outlet/>
    </div>
  )
}

export default Signup

import { useState } from 'react';
import React from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import {auth} from './firebase';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { signInWithEmailAndPassword } from 'firebase/auth';



function Login(){

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit= async (e) =>{
        e.preventDefault()
        try{
            await signInWithEmailAndPassword(auth,email,password)
            console.log("Login Sucessfully")
            window.location.href="/profile"
            toast.success("User logged in Successfully", {
                position: "top-center",
              });
            
        }catch(error ){
            console.log(error)
            toast.error(error.message, {
                position: "bottom-center",
              });
        }
    }
    return(
        <div className='sign-up-container'>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <h1>Log In</h1>
                <label htmlFor='name'>
                    Name:
                    <input type='text'></input>
                </label>
                <label htmlFor='email'>
                        Email:
                        <input type='email' onChange={(e) =>setEmail(e.target.value)} placeholder='amanda...gmail.com'></input>
                </label>
                <label htmlFor='password'>
                    Password:
                    <input type="password"  onChange={(e) =>setPassword(e.target.value)}></input>

                </label>
                <button type='submit'>Log In</button><br></br>
                <p>No Account?<Link to='/signup'>Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;
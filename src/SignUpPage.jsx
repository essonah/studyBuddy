import { useState } from 'react';
import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { auth, db } from './firebase';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Created: ", user);

            if (user) {
                const userData = {
                    email: user.email,
                    name: name,
                };
                console.log("User Data: ", userData);

                await setDoc(doc(db, "Users", user.uid), userData);
                console.log("Document Written");
            }
            toast.success("User Registered Successfully", {
                position: "top-center",
            });
        } catch (error) {
            console.log("Error: ", error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    }

    return (
        <div className='sign-up-container'>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <label htmlFor='name'>
                    Name:
                    <input type='text' id='name' onChange={(e) => setName(e.target.value)} ></input>
                </label>
                <label htmlFor='email'>
                    Email:
                    <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} placeholder='amanda...gmail.com'></input>
                </label>
                <label htmlFor='password'>
                    Password:
                    <input type="password" id='password' onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <button type='submit'>Sign Up</button><br></br>
                <p>Already Registered? <Link to='/login'>Login</Link></p>
            </form>
        </div>
    );
}

export default SignUpPage;

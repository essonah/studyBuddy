
import './App.css';
import Login from './Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import Profile from "./component/Profile";
import {useState} from 'react';
import { auth } from "./firebase";

import {ToastContainer} from 'react-toastify';
import { useEffect } from 'react';
function App() {
  const [user,setUser] =useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/"element={user ? <Navigate to="/profile" /> : <Login />}></Route>
          <Route path="/signup" element={<SignUpPage/>}></Route>
         <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        </Routes>
        <ToastContainer/>
    </BrowserRouter>
    </>
  );
}

export default App;

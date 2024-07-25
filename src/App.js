
import './App.css';
import Login from './Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import Profile from "./component/Profile";
import Home from './component/Home';
import EditProfile from './component/EditProfile';
import {useState} from 'react';
import { auth } from "./firebase";
import CreateRoom from './component/CreateRoom';
import StudyRoom from './component/StudyRoom';

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
          <Route path='/home' element={<Home/>}></Route>
          <Route path="/signup" element={<SignUpPage/>}></Route>
         <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/edit-profile' element={<EditProfile/>}></Route>
        <Route path='/create-room' element={<CreateRoom/>}></Route>
        <Route path="/studyroom/:roomId" element={<StudyRoom />} /> {/* Add this route */}
        </Routes>
        <ToastContainer/>
    </BrowserRouter>
    </>
  );
}

export default App;

import './App.css';
import Login from './Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import Profile from "./component/Profile";
import Home from './component/Home';
import EditProfile from './component/EditProfile';
import { useState, useEffect } from 'react';
import { auth } from "./firebase";
import CreateRoom from './component/CreateRoom';
import StudyRoom from './component/StudyRoom';
import Resources from './component/Resources';

import { ToastContainer } from 'react-toastify';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = (updatedProfile) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedProfile,
    }));
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path='/home' element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile user={user} />} />
          <Route path='/edit-profile' element={<EditProfile user={user} onUpdateProfile={handleUpdateProfile} />} />
          <Route path='/create-room' element={<CreateRoom />} />
          <Route path="/studyroom/:roomId" element={<StudyRoom />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
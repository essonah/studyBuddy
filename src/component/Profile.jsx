import React from 'react';
import { useState, useEffect } from 'react';
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import './Profile.css';

function Profile() {
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log(user);
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                    console.log(docSnap.data());
                } else {
                    console.log("User document does not exist");
                }
            } else {
                console.log("User is not logged in");
            }
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    async function handleLogout() {
        try {
            await auth.signOut();
            window.location.href = '/login';
            console.log("Logged out successfully");
        } catch (error) {
            console.log("Error logging out:", error.message);
        }
    }

    return (
        <div className="profile-container">
            {userDetails ? (
                <div className="profile-card">
                    <h3>Welcome {userDetails.name}</h3>
                    <div>
                        <p>Email: {userDetails.email}</p>
                        <p>Name: {userDetails.name}</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <p className="loading-message">Loading...</p>
            )}
        </div>
    );
}

export default Profile;
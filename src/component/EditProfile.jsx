import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from "../firebase"; // import storage
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // import functions for file handling
import './Profile.css';

function EditProfile() {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            let profilePicURL = '';
            if (profilePic) {
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(storageRef, profilePic);
                profilePicURL = await getDownloadURL(storageRef);
            }

            const docRef = doc(db, "Users", user.uid);
            await setDoc(docRef, { name, topic, profilePic: profilePicURL }, { merge: true });
            alert("Profile updated successfully");
            navigate('/profile');
        } else {
            alert("No user is logged in");
        }
    };

    return (
        <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <h2>Edit Profile</h2>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label> Username: </label>
                    <input type ="text"></input>
                </div>
                <div>
                    <label>Topic of Interest:</label>
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} />
                </div>
                <div>
                    <label>Bio:</label>
                    <input type='text' ></input>
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        </div>
    );
}

export default EditProfile;
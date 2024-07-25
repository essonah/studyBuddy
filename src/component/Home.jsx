import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import './Home.css';

function Home() {
  const [rooms, setRooms] = useState([]);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  useEffect(() => {
    const fetchRoomsAndTopics = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = roomsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, name: data.name, topic: data.topic, createdAt: data.createdAt.toDate() };
        });
        setRooms(roomsData);

        const topicsSnapshot = await getDocs(collection(db, "topics"));
        const topicsData = topicsSnapshot.docs.map(doc => doc.data().name);
        setTopics(topicsData);
      } catch (error) {
        console.error("Error fetching rooms and topics: ", error);
      }
    };

    fetchRoomsAndTopics();
  }, []);

  const navigateToCreateRoom = () => {
    navigate("/create-room"); // Use navigate instead of history.push
  };

  const handleRoomClick = (roomId) => {
    navigate(`/studyroom/${roomId}`);
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <h1>StudyBuddy</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search for rooms..." />
        </div>
        <nav className="nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </nav>
        <div className="user-profile">
          <img src="user-profile-image-url" alt="User profile" />
          <span>@username</span>
        </div>
      </header>
      <main className="main-content">
        <div className="browse-topics">
          <h2>Browse Topics</h2>
          <ul>
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
        <div className="study-rooms">
          <h2>Study Room</h2>
          <p>{rooms.length} Rooms available</p>
          <button onClick={navigateToCreateRoom} className="create-room-btn">Create Room</button>
          {rooms.map((room) => (
            <div key={room.id} className="room" onClick={() => handleRoomClick(room.id)}>
              <div className="room-header">
                <h3>{room.name}</h3>
                <span>{room.topic}</span>
              </div>
              <div className="room-footer">
                <span>{new Date(room.createdAt).toLocaleTimeString()}</span>
                <span>1 Joined</span>
              </div>
            </div>
          ))}
        </div>
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            <li>@ama joined "code_stoppers"</li>
            <li>@ama messaged the group"</li>
            
            {/* Add more activities as needed */}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Home;
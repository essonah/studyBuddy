import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';


function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roomName.trim() === "" || topic.trim() === "") return;
    await addDoc(collection(db, "rooms"), {
      name: roomName,
      topic: topic,
      createdAt: Timestamp.now(),
    });
    await addDoc(collection(db, "topics"), {
      name: topic,
    });
    navigate("/");
  };

  return (
    <div className="create-room-container">
      <h2>Create a New Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roomName">Room Name:</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className='form-group'>
            <label>Description:</label>
            <input type='text' id='topic ' value={topic}>
            </input>
        </div>
        <button type="submit">Create Room</button>
        <button>Cancel</button>
      </form>
    </div>
  );
}

export default CreateRoom;
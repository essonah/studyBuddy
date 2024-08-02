import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import io from 'socket.io-client';
import './StudyRoom.css';

function StudyRoom() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('username'));
  const token = localStorage.getItem('token');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5001', { transports: ['websocket', 'polling'] });

    const fetchData = async () => {
      try {
        const roomRef = doc(db, 'rooms', roomId);
        const unsubscribe = onSnapshot(roomRef, (doc) => {
          if (doc.exists()) {
            const roomData = doc.data();
            setRoom({ id: doc.id, ...roomData });
            setMessages(roomData.messages || []);
          } else {
            setError('Room not found');
          }
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        setError('Error fetching room: ' + error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
      socket.emit('join_room', roomId);
    } else {
      setError('User not authenticated');
      setLoading(false);
    }

    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [roomId, token]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    let fileURL = '';
    if (file) {
      const fileRef = ref(storage, `files/${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
    }

    const message = {
      user,
      text: newMessage,
      fileURL,
      timestamp: new Date().toISOString()
    };

    const socket = io('http://localhost:5001', { transports: ['websocket', 'polling'] });
    socket.emit('send_message', { roomId, message });
    setNewMessage('');
    setFile(null);
    await updateDoc(doc(db, 'rooms', roomId), {
      messages: arrayUnion(message)
    });
  };

  const handleJoinRoom = async () => {
    const roomRef = doc(db, 'rooms', roomId);
    try {
      await updateDoc(roomRef, {
        members: arrayUnion(user)
      });
    } catch (error) {
      setError('Error joining room: ' + error.message);
    }
  };

  const handleStartMeeting = () => {
    const meetingLink = `https://meet.jit.si/${roomId}`;
    setRoom(prevRoom => ({
      ...prevRoom,
      meetingLink,
    }));
    updateDoc(doc(db, 'rooms', roomId), {
      meetingLink,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    
    <div className="study-room">
      <div className='heading'>
      <h2>Study Room</h2>
      <h2>{room?.name}</h2>
      </div>
    
      <div className="top-section">
        
        <div className="members">
    
          <h2>Members:</h2>
          <ul>
            {room?.members?.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Enter your name to join"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
        <div className="meeting">
          <button onClick={handleStartMeeting}>Start Meeting</button>
          {room?.meetingLink && (
            <div className="meeting-link">
              <h2>Join the meeting:</h2>
              <a href={room.meetingLink} target="_blank" rel="noopener noreferrer">
                {room.meetingLink}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="chat">
        <h2>Chat:</h2>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.user === user ? 'my-message' : ''}`}>
              <strong>{message.user}:</strong> {message.text}
              {message.fileURL && (
                <div>
                  <a href={message.fileURL} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </div>
              )}
              <em> ({new Date(message.timestamp).toLocaleTimeString()})</em>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="file">Attach</label>
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default StudyRoom;
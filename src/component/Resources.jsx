import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Resources.css';

function Resources() {
    const [resources, setResources] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const resourcesSnapshot = await getDocs(collection(db, 'resources'));
                const resourcesList = resourcesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Fetched resources:", resourcesList); 
                setResources(resourcesList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching resources:', error);
                setError('Error fetching resources: ' + error.message);
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const handleUpload = async () => {
        if (!file || description.trim() === "" || topic.trim() === "") {
            setError("Please select a file, add a description, and choose a topic");
            return;
        }
        try {
            const fileRef = ref(storage, `resources/${file.name}`);
            await uploadBytes(fileRef, file);
            const fileURL = await getDownloadURL(fileRef);

            await addDoc(collection(db, 'resources'), {
                description,
                fileURL,
                topic,
                timestamp: new Date().toISOString(),
            });

            console.log("File uploaded:", fileURL); 

            setFile(null);
            setDescription('');
            setTopic('');
            setError(null);

            // Refresh resources list
            const resourcesSnapshot = await getDocs(collection(db, 'resources'));
            const resourcesList = resourcesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setResources(resourcesList);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Error uploading file: ' + error.message);
        }
    };

    const filteredResources = resources.filter(resource =>  
        (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.topic && resource.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="resources-container">
            <div className="resources-image">
                <img src="https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzb3VyY2V8ZW58MHx8MHx8fDA%3D" alt="Background" />
            </div>
            <div className="resources">
                <h2>Shared Resources</h2>
                <div className="upload-form">
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="File description" />
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
                    <button onClick={handleUpload}>Upload</button>
                </div>
                <div>
                    <input type="text" value={searchTerm} placeholder="Search for resources..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="resources-list">
                    <h3>Available Resources</h3>
                    {filteredResources.length > 0 ? (
                        <ul>
                            {filteredResources.map((resource) => (
                                <li key={resource.id}>
                                    <a href={resource.fileURL} target="_blank" rel="noopener noreferrer">{resource.description}</a>
                                    <em> ({new Date(resource.timestamp).toLocaleString()})</em>
                                    <p><strong>Topic:</strong> {resource.topic}</p> {/* Display topic */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No resources found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Resources;
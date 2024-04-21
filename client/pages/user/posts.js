import { useState } from 'react';
import axios from 'axios';

export default function Posts() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const token = localStorage.getItem('token'); 

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                // Convert image to Base64 encoded string
                const reader = new FileReader();
                reader.onloadend = () => {
                    formData.append('image', reader.result);
                    // Send formData with Base64 encoded image
                    sendFormData(formData);
                };
                reader.readAsDataURL(image);
            } else {
                // Send formData without image
                sendFormData(formData);
            }
        } catch (error) {
            console.error('Error posting:', error);
        }
    };

    const sendFormData = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/social', formData, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Post created:', response.data);
            // Clear the form or redirect as needed
        } catch (error) {
            console.error('Error posting:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handlePostSubmit}>
                <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
}

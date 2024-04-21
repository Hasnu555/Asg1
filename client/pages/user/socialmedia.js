import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:5000/social')
          .then(response => {
              console.log("API response:", response.data); // Check what the API returned
              setPosts(response.data || []); // Set posts to response data or fallback to an empty array
          })
          .catch(error => {
              console.error("Failed to fetch posts:", error);
              toast.error("Failed to fetch posts");
          });
  }, []);
  
    console.log("Rendering posts:", posts);

    return (
        <div>
            {posts.map(post => (
                <div key={post.postId}>
                    {/* <h3>{post.title}</h3> */}
                    <p>{post.content}</p>
                    <Link href={`/posts/${post.postId}`}>View Post</Link>
                </div>
            ))}
        </div>
    );
};

export default HomePage;

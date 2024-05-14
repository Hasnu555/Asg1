import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Avatar, Card, Image } from 'antd';

import PostList from '../../components/cards/PostList';


const { Meta } = Card;

const FriendProfile = () => {
  const router = useRouter();
  const { friendId } = router.query;
  const [friendProfile, setFriendProfile] = useState(null);
  const [friendPosts, setFriendPosts] = useState([]);

  useEffect(() => {
    if (friendId) {
      fetchFriendProfile();
      fetchUserPost(); // Fetch friend's posts when friendId changes
    }
  }, [friendId]);

  const fetchFriendProfile = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/friendinfo/${friendId}`);
      setFriendProfile(data);
    } catch (error) {
      console.error('Error fetching friend profile:', error);
    }
  };

  const fetchUserPost = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/friend-posts/${friendId}`);
  
      // Transform friend posts data
      const transformedFriendPosts = data.posts.map((post) => ({
        ...post,
        postedBy: post.author,
        authorimage: post.author.imageUrl,
        like: post.likes.map((user) => user._id),
        comments: post.comments.map((comment) => ({
          _id: comment._id,
          text: comment.content,
          created: comment.createdAt,
          postedBy: comment.author.name,
          posterimage: comment.author.imageUrl,
        })),
        imageUrl: `file:///${post.imageUrl}`, // Assuming this is the correct image URL format
      }));
  
      // Set the transformed friend posts in state
      setFriendPosts(transformedFriendPosts);
      console.log('Friend posts:', transformedFriendPosts);
    } catch (error) {
      console.error('Error fetching friend posts:', error);
    }
  };
  

  return (
    <div className="container">
      {friendProfile && (
        <Card style={{ width: 870 }}>
          <div style={{ display: 'flex' }}>
            <Image
              alt="user avatar"
              src={friendProfile.imageUrl}
              style={{ width: 150, height: 150, marginRight: 16 }}
            />
            <Meta
              title={<span style={{ fontSize: 25 }}>{friendProfile.name}</span>}
              description={
                <div>
                  <p style={{ fontSize: 20, marginBottom: 8, color: '#333'}}>{`${friendProfile.email}`}</p>
                  <p style={{ fontSize: 20, marginBottom: 8, color: '#333'}}>{`${friendProfile.age} years old`}</p>
                </div>
              }
            />
          </div>    
        </Card>
      )}
      <div className="mt-4">
        <h3>Friend's Posts</h3>
        {friendPosts.length > 0 ? (
          <PostList posts={friendPosts} fetchUserPost={fetchUserPost} />
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;

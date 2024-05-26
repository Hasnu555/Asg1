import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context';
import axios from 'axios';
import Link from 'next/link';
import MyPostList from '../../components/cards/MyPostList';
import { useRouter } from 'next/router';
import { Avatar, Button, Card, Image } from 'antd';
import UserRoute from '../../components/routes/UserRoute';

import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";



const { Meta } = Card;

import { toast } from "react-toastify";

const UserProfile = () => {
  const [state, setState] = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [editablePostId, setEditablePostId] = useState(null); // State to track the currently editable post
  const [updatedContent, setUpdatedContent] = useState(''); // State to manage the updated content


  const router = useRouter();
  const { userId } = router.query; // Assuming you're using dynamic routing

  useEffect(() => {
    if (state && state.token) {
      fetchUserProfile();
      fetchFriendRequests();
      fetchUserPost();
    }
  }, [state, userId]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/currentUser`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPost = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/showUserPosts",{headers: { Authorization: `Bearer ${state.token}` },});
      const transformedPosts = data.map((post) => ({
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
        imageUrl: `file:///${post.imageUrl}`,
      }));
      setPosts(transformedPosts);
      console.log(posts);
    } catch (error) {
      console.log("ERROR while post-fetching Client => ", error);
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      await axios.post(`http://localhost:5000/accept-friend-request/${friendId}`);
      toast.success("Friend request accepted successfully");
      getSuggestedFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request");
    }
  };

  const rejectFriendRequest = async (friendId) => {
    try {
      await axios.post(`http://localhost:5000/reject-friend-request/${friendId}`);
      toast.success("Friend request rejected successfully");
      getSuggestedFriends();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Failed to reject friend request");
    }
  };

  
  const fetchFriendRequests = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/friend-requests`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setFriendRequests(data.friendRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };
  

  return (
    <UserRoute>
    <div className="container-fluid">
      
      {/* <div className="row py-5 bg-default-image">
        
        <div className="col text-center">
          
          <h1>Home Feed</h1>
        </div>
      </div> */}

      <div className="row py-3">
        <div className="col-md-8">
        {userProfile && (
  <Card style={{ width: 870 }}>
    <div style={{ display: 'flex' }}>
      <Image
        alt="user avatar"
        src={userProfile.imageUrl}
        style={{ width: 150, height: 150, marginRight: 16 }}
      />
      <div>
      <Meta
          title={<span style={{ fontSize: 25 }}>{userProfile.name}</span>}
          description={
            <div>
              <p style={{ fontSize: 20, marginBottom: 8, color: '#333'}}>{`${userProfile.email}`}</p>
              <p style={{ fontSize: 20,color: '#333' }}>{`${userProfile.age} years old`}</p>
            </div>
          }
        />
      </div>
    </div>
  </Card>
)}

          <br />

          

          {/* pre tag to read json data nicely */}
          {/* <pre>{JSON.stringify(post, null, 4)}</pre> */}
          <MyPostList posts={posts} fetchUserPost={fetchUserPost} />
          
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
        
     <h4>Friend Requests</h4>
     <ul style={{ listStyle: "none", padding: 0 }}>
       {friendRequests.map((request) => (
        <li key={request._id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar size={50} alt={request.name} src={request.imageUrl} style={{ marginRight: "10px" }} />
            <div><strong>{request.name}</strong></div>
          </div>
          <div>
            <Button type="primary" onClick={() => acceptFriendRequest(request._id)}>Accept</Button>
            <Button onClick={() => rejectFriendRequest(request._id)}>Reject</Button>
          </div>
        </li>
      ))}
    </ul>
  
          
        </div>
      </div>
     </div>
     </UserRoute>
  );
};

export default UserProfile;

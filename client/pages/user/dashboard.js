import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
// import CreatePostForm from "../../components/forms/CreatePostForm";
import CreatePostForm from "../../components/forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import SearchBar from "../../components/SearchBar"; // Import the SearchBar component


const Home = () => {
  const [state, setState] = useContext(UserContext);
  //state
  const [content, setContent] = useState("");
  
  const [posts, setPosts] = useState([
    {
      content: "This is a sample post content from a rich text editor",
      postedBy: "622d34f4c11f497f1b708cbb",
      image: {
        url: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
        public_id: "sample_image_123",
      },
      like: ["622d34f4c11f497f1b708ccc"],
      comment: [
        {
          text: "Great post!",
          created: new Date(),
          postedBy: "622d34f4c11f497f1b708cdd",
        },
      ],
    },
  ]); // posts
  const [image, setImage] = useState(null); // State to hold the file
  const [uploading, setUploading] = useState(false); // State to show uploading status

  const [people, setPeople] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      secret: "My secret",
      about: "Software developer",
      username: "johndoe",
      image: {
        url: "https://example.com/john.jpg",
        public_id: "john_image_123",
      },
      following: [],
      followers: [],
    },
  ]); //people

  const router = useRouter();
  // here when the page render then the post in render and (later on) also user to follow
  useEffect(() => {
    if (state && state.token) {
      fetchUserPost(); // to fetch post
      
      getSuggestedFriends(); 
      // findPeople();
    }
  }, [state && state.token]);

  // this function make a request to backend to fetch all the post of the user
  const fetchUserPost = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/social");
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
    } catch (error) {
      console.log("ERROR while post-fetching Client => ", error);
    }
  };

  
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/social",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("create post response => ", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        fetchUserPost();
        toast.success("Post created");
        setContent("");
        setImage(null);
      }
    } catch (error) {
      console.log("Error from dashboard =>", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFollow = async (user) => {
    await sendFriendRequest(user._id);
  };

  const getSuggestedFriends = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/suggested-friends");
      setPeople(data.suggestedFriends);
      
    } catch (error) {
      console.log("Error fetching suggested friends:", error);
    }
  };

  const sendFriendRequest = async (recipientId) => {
    try {
      await axios.post(`http://localhost:5000/send-friend-request/${recipientId}`);
      toast.success("Friend request sent successfully");
      
      getSuggestedFriends(); 
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request");
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

  return (
    // <UserRoute>
    <div className="container-fluid">
      <div className="row py-5 bg-default-image">
        <div className="col text-center">
          <h1>Newfeed</h1>
        </div>
      </div>

      <div className="row py-3">
        <div className="col-md-8">
          <CreatePostForm
            content={content}
            setContent={setContent}
            postSubmit={postSubmit}
            handleImage={handleImage}
            image={image}
            uploading={uploading}
          />

          <br />
          {/* pre tag to read json data nicely */}
          {/* <pre>{JSON.stringify(post, null, 4)}</pre> */}
          <PostList posts={posts} fetchUserPost={fetchUserPost} />
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
        <SearchBar setSearchResults={setPeople} /> {/* Integrate the SearchBar component */}
          
          {/* following tag */}
          {state && state.user && state.user.following && (
            <Link href={`/user/following`} className="h6 text-decoration-none">
              {state.user.following.length} Following
            </Link>
          )}

          <People
            people={people}
            handleFollow={handleFollow}
            // acceptFriendRequest={acceptFriendRequest}
            // rejectFriendRequest={rejectFriendRequest}
          />
        </div>
      </div>
    </div>
    // </UserRoute>
  );
};

export default Home;

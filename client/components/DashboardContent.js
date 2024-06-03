import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context"; // Ensure the correct path
import CreatePostForm from "./forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "./cards/PostList";
import People from "./cards/People";
import SearchBar from "./SearchBar"; // Import the SearchBar component

const DashboardContent = () => {
  const [state] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [people, setPeople] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchUserPost();
    getSuggestedFriends();
  }, [state, router]);

  const fetchUserPost = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/social");
      setPosts(data);
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

  const getSuggestedFriends = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/suggested-friends"
      );
      setPeople(data.suggestedFriends);
    } catch (error) {
      console.log("Error fetching suggested friends:", error);
    }
  };

  const handleFollow = async (user) => {
    try {
      await axios.post(`http://localhost:5000/send-friend-request/${user._id}`);
      toast.success("Friend request sent successfully");
      getSuggestedFriends();
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request");
    }
  };

  return (
    <div className="container-fluid dashboard-content">
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
          <PostList posts={posts} fetchUserPost={fetchUserPost} />
        </div>
        <div className="col-md-4">
          <SearchBar setSearchResults={setPeople} />
          {state && state.user && state.user.following && (
            <Link href={`/user/following`} className="h6 text-decoration-none">
              {state.user.following.length} Following
            </Link>
          )}
          <People people={people} handleFollow={handleFollow} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

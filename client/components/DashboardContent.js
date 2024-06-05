import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context"; // Ensure the correct path
import CreatePostForm from "./forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "./cards/PostList";
import People from "./cards/People";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import { Col, Row, Button, Typography } from "antd";
import Link from "next/link";

const { Title } = Typography;

const DashboardContent = () => {
  const [state] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [people, setPeople] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      fetchUserPost();
      getSuggestedFriends();
    }
  }, [state && state.token]);

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
      const { data } = await axios.get(
        "http://localhost:5000/suggested-friends"
      );
      setPeople(data.suggestedFriends);
    } catch (error) {
      console.log("Error fetching suggested friends:", error);
    }
  };

  const sendFriendRequest = async (recipientId) => {
    try {
      await axios.post(
        `http://localhost:5000/send-friend-request/${recipientId}`
      );
      toast.success("Friend request sent successfully");
      getSuggestedFriends();
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request");
    }
  };

  return (
    <div className="container-fluid">
      <Row className="py-3" gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <CreatePostForm
            content={content}
            setContent={setContent}
            postSubmit={postSubmit}
            handleImage={handleImage}
            image={image}
            uploading={uploading}
          />
          <PostList posts={posts} fetchUserPost={fetchUserPost} />
        </Col>
        <Col xs={24} md={8}>
          <SearchBar setSearchResults={setPeople} />
          {state && state.user && state.user.following && (
            <Link href={`/user/following`}>
              <Button type="link" className="h6 text-decoration-none">
                {state.user.following.length} Following
              </Button>
            </Link>
          )}
          <People people={people} handleFollow={handleFollow} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;

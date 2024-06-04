import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context";
import GroupPostForm from "../../components/GroupPostForm";

const GroupPage = () => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  const { id: groupId } = router.query; // Correctly destructure groupId
  const [group, setGroup] = useState({});
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchGroup();
      fetchPosts();
    }
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      console.log(`Fetching group with ID: ${groupId}`);
      const { data } = await axios.get(
        `http://localhost:5000/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      console.log("Group data:", data);
      setGroup(data);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      console.log(`Fetching posts for group ID: ${groupId}`);
      const { data } = await axios.get(
        `http://localhost:5000/group/${groupId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      console.log("Posts data:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    console.log("Submitting post...");

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const { data } = await axios.post(
        `http://localhost:5000/group/${groupId}/post`, // Fixed URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Post created:", data);
      setPosts([data.post, ...posts]);
      setContent("");
      setImage(null);
      setUploading(false);
    } catch (error) {
      console.error("Error creating post:", error);
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-light">{group.name}</h1>
      <p className="text-light">{group.description}</p>

      <GroupPostForm
        content={content}
        setContent={setContent}
        postSubmit={handlePostSubmit}
        handleImage={(e) => setImage(e.target.files[0])}
        uploading={uploading}
        image={image}
      />

      <div className="list-group mt-4">
        {posts.map((post) => (
          <div key={post._id} className="list-group-item bg-dark text-light">
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt={post.content}
                className="img-thumbnail"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPage;

import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context";
import GroupPostForm from "../../components/GroupPostForm";
import { List, Button, Card, Avatar } from "antd";
import { LikeOutlined, LikeFilled, UserOutlined } from "@ant-design/icons";

const GroupPage = () => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  const { id: groupId } = router.query;
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
      const { data } = await axios.get(
        `http://localhost:5000/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      setGroup(data);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/group/${groupId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostSubmit = async () => {
    setUploading(true);

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const { data } = await axios.post(
        `http://localhost:5000/group/${groupId}/post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts([data.post, ...posts]);
      setContent("");
      setImage(null);
      setUploading(false);
    } catch (error) {
      console.error("Error creating post:", error);
      setUploading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/group/post/${postId}/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      fetchPosts(); // Refresh posts to reflect the like
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="container mt-5">
      <Card
        title={<h1 className="text-light">{group.name}</h1>}
        bordered={false}
        style={{ backgroundColor: "#1f1b24", color: "#ffffff" }}
      >
        <p className="text-light">{group.description}</p>
      </Card>

      <GroupPostForm
        content={content}
        setContent={setContent}
        postSubmit={handlePostSubmit}
        handleImage={(file) => {
          setImage(file);
          return false;
        }}
        uploading={uploading}
        image={image}
      />

      <List
        itemLayout="vertical"
        dataSource={posts}
        renderItem={(post) => (
          <Card
            style={{
              backgroundColor: "#1f1b24",
              color: "#ffffff",
              marginTop: "20px",
            }}
            key={post._id}
            actions={[
              <Button
                icon={
                  post.likes.includes(state.user._id) ? (
                    <LikeFilled />
                  ) : (
                    <LikeOutlined />
                  )
                }
                onClick={() => handleLikePost(post._id)}
                type="text"
                style={{ color: "#ffffff" }}
              >
                {post.likes.length}
              </Button>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={<span style={{ color: "#ffffff" }}>{post.content}</span>}
              description={
                post.image && (
                  <img
                    src={post.image}
                    alt={post.content}
                    className="img-thumbnail"
                  />
                )
              }
            />
          </Card>
        )}
        className="group-post-list"
      />
    </div>
  );
};

export default GroupPage;

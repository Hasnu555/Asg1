import React, { useContext, useState } from "react";
import { UserContext } from "../../context/index.js";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import { Avatar, Tooltip, Button, Card, List, Input, Form } from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  DownOutlined,
  UpOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";

const PostList = ({ posts, fetchUserPost }) => {
  const [state] = useContext(UserContext);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);

  const router = useRouter();

  const handleLike = async (postId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/social/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      fetchUserPost();
      setLikedPosts((prev) => [...prev, postId]);
      console.log("Like response:", data);
    } catch (error) {
      console.error(
        "Error liking post:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/social/${postId}/like`,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      fetchUserPost();
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
      console.log("Unlike response:", data);
    } catch (error) {
      console.error(
        "Error unliking post:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/social/${postId}/comments`,
        { content },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      fetchUserPost();
      console.log("Comment response:", data);
    } catch (error) {
      console.error(
        "Error creating comment:",
        error.response ? error.response.data : error
      );
    }
  };

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <List
      itemLayout="vertical"
      dataSource={posts}
      renderItem={(post) => (
        <Card
          key={post._id}
          className="mb-4"
          style={{ backgroundColor: "#1f1b24", color: "#ffffff" }}
        >
          <Card.Meta
            avatar={<Avatar src={post.authorimage} />}
            title={
              <div>
                <strong>{post.postedBy && post.postedBy.name}</strong>
                <span className="text-muted mx-3">
                  {moment(post.createdAt).fromNow()}
                </span>
              </div>
            }
            description={
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            }
          />
          {post.imageBase64 && (
            <Image
              src={post.imageBase64}
              width={20}
              height={20}
              alt="post image"
              style={{ width: "100%", height: "auto", marginTop: "10px" }}
            />
          )}
          <div className="mt-3">
            <Button
              type="text"
              icon={<LikeOutlined />}
              className="text-danger"
              onClick={() => handleLike(post._id)}
            >
              {post.like ? post.like.length : 0} Likes
            </Button>
            <Button
              type="text"
              icon={<DislikeOutlined />}
              className="text-danger"
              onClick={() => handleUnlike(post._id)}
            />
            <Button type="link" onClick={() => toggleComments(post._id)}>
              <CommentOutlined className="text-danger" />
              {visibleComments[post._id] ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </div>
          {visibleComments[post._id] && (
            <div className="p-3 border-top">
              {post.comments &&
                post.comments.map((comment, index) => (
                  <div key={index} className="d-flex align-items-center mt-2">
                    <Tooltip
                      title={moment(comment.created).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    >
                      <Avatar
                        size={25}
                        src={comment.posterimage}
                        className="avatar"
                      />
                      <strong className="mx-2">{comment.postedBy}</strong>
                      <p style={{ width: "100%" }}>{comment.text}</p>
                    </Tooltip>
                    {index !== post.comments.length - 1 && <hr />}
                  </div>
                ))}
              <Form
                onFinish={() => {
                  handleComment(post._id, commentContent);
                  setCommentContent("");
                }}
              >
                <Form.Item>
                  <Input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-input"
                    style={{ marginBottom: "10px" }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Comment
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Card>
      )}
    />
  );
};

export default PostList;

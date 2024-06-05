"use client";

import React, { useContext, useState } from "react";
import { UserContext } from "../../context/index.js";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import { Avatar, Tooltip, Button, Input, Card, List, Form } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  DownOutlined,
  UpOutlined,
  LikeOutlined,
  DislikeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const MyPostList = ({ posts, fetchUserPost }) => {
  const [state] = useContext(UserContext);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const [editedContent, setEditedContent] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);

  const router = useRouter();

  const handleUpdatePost = async (postId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/social/${postId}`,
        { content: editedContent[postId] },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      fetchUserPost();
      console.log("Update post response:", data);
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/social/${postId}`,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      fetchUserPost();
      console.log("Delete post response:", data);
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response ? error.response.data : error
      );
    }
  };

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
                <strong style={{ color: "#bb86fc" }}>
                  {post.postedBy.name}
                </strong>
                <span className="text-muted mx-3" style={{ color: "#bb86fc" }}>
                  {moment(post.createdAt).fromNow()}
                </span>
              </div>
            }
            description={
              editedContent[post._id] !== undefined ? (
                <Input.TextArea
                  value={editedContent[post._id]}
                  onChange={(e) =>
                    setEditedContent({
                      ...editedContent,
                      [post._id]: e.target.value,
                    })
                  }
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ backgroundColor: "#2c2c2c", color: "#ffffff" }}
                />
              ) : (
                <div>
                  <div
                    style={{ color: "#bb86fc" }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  {post.imageBase64 && (
                    <Image
                      src={post.imageBase64}
                      width={20}
                      height={20}
                      alt="post image"
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </div>
              )
            }
          />
          <div className="mt-3">
            <Button
              type="text"
              icon={<LikeOutlined />}
              className="text-danger"
              onClick={() => handleLike(post._id)}
            >
              {post.like.length} Likes
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
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-primary"
              onClick={() =>
                setEditedContent({
                  ...editedContent,
                  [post._id]: post.content,
                })
              }
            />
            {editedContent[post._id] !== undefined && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdatePost(post._id);
                  setEditedContent({
                    ...editedContent,
                    [post._id]: undefined,
                  });
                }}
              >
                Save
              </Button>
            )}
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-danger"
              onClick={() => {
                if (confirm("Are you sure you want to delete this post?")) {
                  handleDeletePost(post._id);
                }
              }}
            />
          </div>
          {visibleComments[post._id] && (
            <div
              className="p-3 border-top"
              style={{ backgroundColor: "#2c2c2c" }}
            >
              {post.comments.map((comment, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                  <Tooltip
                    title={moment(comment.created).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  >
                    <Avatar size={25} src={comment.posterimage} />
                    <strong className="mx-2" style={{ color: "#bb86fc" }}>
                      {comment.postedBy}
                    </strong>
                    <p style={{ width: "100%", color: "#ffffff" }}>
                      {comment.text}
                    </p>
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
                    style={{
                      marginBottom: "10px",
                      backgroundColor: "#2c2c2c",
                      color: "#ffffff",
                    }}
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

export default MyPostList;

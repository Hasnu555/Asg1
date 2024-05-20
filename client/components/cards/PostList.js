"use client";

import React, { useContext, useState } from "react";
import { UserContext } from "../../context/index.js";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import { Avatar, Tooltip, Button } from "antd";
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
    <>
      {posts.map((post) => (
        <div key={post._id} className="card mb-5">
          <div className="card-header">
            <Avatar src={post.authorimage} />
            <strong>{post.postedBy.name}</strong>
            <span className="pt-2 mx-3">
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {post.imageBase64 && (
              // console.log("post.imageBase64", post.imageBase64),
              <Image
                src={post.imageBase64}
                width={20}
                height={20}
                alt="post image"
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
          <div className="card-footer">
            <LikeOutlined
              onClick={() => handleLike(post._id)}
              className="text-danger pt-2 h5 px-2"
            />
            <DislikeOutlined
              onClick={() => handleUnlike(post._id)}
              className="text-danger pt-2 h5 px-2"
            />
            <span className="pt-2">{post.like.length} Likes</span>
            <Button type="link" onClick={() => toggleComments(post._id)}>
              <CommentOutlined className="text-danger pt-2 h5 px-2 mx-3" />
              {visibleComments[post._id] ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </div>
          {visibleComments[post._id] && (
            <div className="bg-white p-3 border-top">
              {post.comments.map((comment, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                  <Tooltip
                    title={moment(comment.created).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  >
                    <Avatar size={25} src={comment.posterimage} />
                    <strong className="mx-2">{comment.postedBy}</strong>
                    <p style={{ width: "100%" }}>{comment.text}</p>
                  </Tooltip>
                  {index !== post.comments.length - 1 && <hr />}
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleComment(post._id, commentContent);
                  setCommentContent("");
                }}
              >
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  style={{
                    width: "80%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />
                <Button type="primary" htmlType="submit">
                  Comment
                </Button>
              </form>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default PostList;

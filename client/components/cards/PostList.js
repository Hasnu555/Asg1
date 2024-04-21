import React, { useContext, useState } from "react";
import { UserContext } from "../../context";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import { Avatar, Tooltip, Button } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const PostList = ({ posts, fetchUserPost }) => {
  const [state] = useContext(UserContext);
  const [visibleComments, setVisibleComments] = useState({});
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
      console.log("Like response:", data);
      // Optionally refresh post data here
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
      console.log("Unlike response:", data);
      // Optionally refresh post data here
    } catch (error) {
      console.error(
        "Error unliking post:",
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
            <span className="pt-2 mx-3">{moment(post.createdAt).fromNow()}</span>
          </div>
          <div className="card-body">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.imageUrl = "" && (
              <div style={{
                backgroundImage: `url(${post.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px",
                margin: "10px 0"
              }}></div>
            )}
          </div>
          <div className="card-footer">
            {post.like.includes(state.user._id) ? (
              <HeartFilled onClick={() => handleUnlike(post._id)} className="text-danger pt-2 h5 px-2" />
            ) : (
              <HeartOutlined onClick={() => handleLike(post._id)} className="text-danger pt-2 h5 px-2" />
            )}
            <span className="pt-2">{post.like.length} Likes</span>
            <Button type="link" onClick={() => toggleComments(post._id)}>
              <CommentOutlined className="text-danger pt-2 h5 px-2 mx-3"/>
              <span>{post.comment.length} Comments</span>
              {visibleComments[post._id] ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </div>
          {/* Comment Section */}
          {visibleComments[post._id] && (
            <div className="bg-white p-3 border-top">
              {post.comment.map((comment, index) => (
                <div key={comment._id} className="d-flex align-items-center mt-2">
                  <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                    <strong className="mx-2">{comment.postedBy.name}</strong>
                  </Tooltip>
                  <p>{comment.text}</p>
                  {index !== post.comment.length - 1 && <hr />} {/* Divider */}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default PostList;

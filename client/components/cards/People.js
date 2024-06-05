import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/index.js";
import { Avatar, Button, Modal, Input, List, Typography } from "antd";
import Link from "next/link";
import socketIOClient from "socket.io-client";
import axios from "axios";

const { Text, Title } = Typography;
const ENDPOINT = "http://localhost:5000";

const People = ({ people, handleFollow }) => {
  const [state] = useContext(UserContext);
  const socket = socketIOClient(ENDPOINT, {
    auth: {
      token: state.token,
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (state.user) {
      socket.emit("join", state.user._id);

      socket.on("receiveMessage", (message) => {
        if (message.sender === selectedPerson?._id) {
          setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [state.user, selectedPerson]);

  const showMessageModal = async (person) => {
    setSelectedPerson(person);
    const history = await fetchChatHistory(person._id);
    setChatHistory(history);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/chats",
        {
          sender: state.user,
          receiver: selectedPerson._id,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const sentMessage = response.data;
      setChatHistory([...chatHistory, sentMessage]);
      socket.emit("sendMessage", sentMessage);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMessage("");
  };

  const fetchChatHistory = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/chats/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }
  };

  return (
    <div className="people-list-container">
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(person) => (
          <List.Item
            actions={[
              <Button
                className="send-request-button"
                onClick={() => handleFollow(person)}
              >
                Send Request
              </Button>,
              <Button
                className="send-message-button"
                onClick={() => showMessageModal(person)}
              >
                Send Message
              </Button>,
            ]}
            className="people-list-item"
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={50}
                  src={person.imageBase64}
                  className="people-avatar"
                />
              }
              title={
                <Link href={`/friend-profile/${person._id}`}>
                  <Text className="people-name">{person.name}</Text>
                </Link>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title={`Send Message to ${selectedPerson?.name}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            className="send-message-button"
          >
            Send
          </Button>,
        ]}
      >
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-message">
              <strong>
                {chat.sender === state.user ? "You" : selectedPerson.name}:
              </strong>{" "}
              {chat.message}
              <div className="chat-timestamp">
                {new Date(chat.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <Input.TextArea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
        />
      </Modal>
    </div>
  );
};

export default People;

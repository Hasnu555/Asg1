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
    <div style={{ padding: "20px" }}>
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(person) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => handleFollow(person)}>
                Send Request
              </Button>,
              <Button type="default" onClick={() => showMessageModal(person)}>
                Send Message
              </Button>,
            ]}
            style={{
              backgroundColor: "#1f1b24",
              borderRadius: "5px",
              marginBottom: "10px",
              padding: "10px",
              color: "#ffffff",
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={50}
                  src={person.imageBase64}
                  style={{ cursor: "pointer" }}
                />
              }
              title={
                <Link href={`/friend-profile/${person._id}`}>
                  <Text style={{ color: "#bb86fc" }}>{person.name}</Text>
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
          <Button key="submit" type="primary" onClick={handleOk}>
            Send
          </Button>,
        ]}
      >
        <div
          style={{
            marginBottom: "10px",
            maxHeight: "200px",
            overflowY: "scroll",
            backgroundColor: "#2c2c2c",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {chatHistory.map((chat, index) => (
            <div key={index} style={{ padding: "5px 0", color: "#ffffff" }}>
              <strong>
                {chat.sender === state.user ? "You" : selectedPerson.name}:
              </strong>{" "}
              {chat.message}
              <div style={{ fontSize: "12px", color: "#888" }}>
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
          style={{
            backgroundColor: "#2c2c2c",
            color: "#ffffff",
            borderRadius: "5px",
            border: "1px solid #3a3a3a",
          }}
        />
      </Modal>
    </div>
  );
};

export default People;

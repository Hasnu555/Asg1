import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../context/index.js";
import { Avatar, Button, Modal, Input } from 'antd';
import Link from 'next/link';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

const ENDPOINT = 'http://localhost:5000';

const People = ({ people, handleFollow }) => {
  const [state] = useContext(UserContext);
  const socket = socketIOClient(ENDPOINT, {
    auth: {
      token: state.token
    },
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (state.user) {
      socket.emit('join', state.user._id);

      socket.on('receiveMessage', (message) => {
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
      const response = await axios.post('http://localhost:5000/chats', {
        sender: state.user,
        receiver: selectedPerson._id,
        message
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const sentMessage = response.data;
      setChatHistory([...chatHistory, sentMessage]);
      socket.emit('sendMessage', sentMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMessage('');
  };

  const fetchChatHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/chats/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {people.map((person) => (
          <li
            key={person._id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link href={`/friend-profile/${person._id}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <Avatar
                  size={50}
                  alt={person.name}
                  src={person.imageBase64}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                <div>
                  <strong>{person.name}</strong>
                </div>
              </div>
            </Link>
            <div>
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '5px',
                }}
                onClick={() => handleFollow(person)}
              >
                Send Request
              </button>
              <button
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => showMessageModal(person)}
              >
                Send Message
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        title={`Send Message to ${selectedPerson?.name}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ marginBottom: '10px', maxHeight: '200px', overflowY: 'scroll' }}>
          {chatHistory.map((chat, index) => (
            <div key={index} style={{ padding: '5px 0' }}>
              <strong>{chat.sender === state.user ? 'You' : selectedPerson.name}:</strong> {chat.message}
              <div style={{ fontSize: '12px', color: '#888' }}>{new Date(chat.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <Input.TextArea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
      </Modal>
    </div>
  );
};

export default People;

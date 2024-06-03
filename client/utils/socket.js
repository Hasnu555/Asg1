// utils/socket.js
import io from 'socket.io-client';

let socket;

if (typeof window !== 'undefined') {
 

  const token = localStorage.getItem('token'); // Get the token from localStorage

  socket = io('http://localhost:5000', {
    auth: {
      token: token,
    },
  });
  console.log('Socket connected');
}

export default socket;

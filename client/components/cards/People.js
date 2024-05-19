// components/People.js

import React from 'react';
import { Avatar, Button } from 'antd';
import Link from 'next/link';

const People = ({ people, handleFollow }) => {
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
  <div style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
<button
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleFollow(person)}
            >
              Send Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default People;

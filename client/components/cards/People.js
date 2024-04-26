import React from "react";

import { Avatar, Tooltip, Button } from "antd";


const People = ({ people, handleFollow }) => {
  return (
    <div>
      <h4>People you may know</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {people.map((person) => (
          <li key={person._id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar size={50} alt={person.name}  src={person.imageBase64} style={{ marginRight: "10px" }} />
              <div><strong>{person.name}</strong></div>
            </div>
            <button style={{ backgroundColor: "#007bff", color: "#fff", padding: "5px 10px", borderRadius: "5px", border: "none", cursor: "pointer" }} onClick={() => handleFollow(person)}>Send Request</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default People;

// components/SearchBar.js

import React, { useState } from "react";
import axios from "axios";
import { Input, Button } from "antd"; // Import Ant Design components

const { Search } = Input; // Destructure the Search component from Input

const SearchBar = ({ setSearchResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/search/users?query=${query}`
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div>
      {/* Use Ant Design Search component */}
      <Search
        placeholder="Search for users..."
        enterButton="Search"
        size="large"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch} // Use onSearch event handler instead of onClick for the button
      />
    </div>
  );
};

export default SearchBar;

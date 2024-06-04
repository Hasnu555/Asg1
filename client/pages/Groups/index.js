import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../../context";
import GroupPostForm from "../../components/GroupPostForm";

const Groups = () => {
  const [state] = useContext(UserContext);
  const [yourGroups, setYourGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${state.token}`,
      };
      console.log("Headers: ", headers); // Debug line to print headers
      const { data } = await axios.get("http://localhost:5000/group/myGroups", {
        headers,
      });
      setYourGroups(data.yourGroups || []);
      setAllGroups(data.allGroups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-light">Your Groups</h1>
      <div className="list-group mt-4">
        {yourGroups.map((group) => (
          <Link key={group._id} href={`/group/${group._id}`} legacyBehavior>
            <a className="list-group-item list-group-item-action bg-dark text-light">
              <img
                src={group.image}
                alt={group.name}
                className="img-thumbnail"
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
              {group.name}
            </a>
          </Link>
        ))}
      </div>

      <h1 className="text-light mt-5">All Groups</h1>
      <div className="list-group mt-4">
        {allGroups.map((group) => (
          <Link key={group._id} href={`/groups/${group._id}`} legacyBehavior>
            <a className="list-group-item list-group-item-action bg-dark text-light">
              <img
                src={group.image}
                alt={group.name}
                className="img-thumbnail"
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
              {group.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Groups;

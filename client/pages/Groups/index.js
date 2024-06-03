import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../../context";

const Groups = () => {
  const [state] = useContext(UserContext);
  const [yourGroups, setYourGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await axios.get("/api/groups/myGroups", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
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

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/group/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      router.push(`/group/${data._id}`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="container">
      <h1>Create Group</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Group Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Group Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImage}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;

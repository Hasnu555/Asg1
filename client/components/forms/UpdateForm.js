import { SyncOutlined, CameraOutlined } from "@ant-design/icons";

const UpdateForm = ({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  age,
  setAge,
  loading,
  profileUpdate,
  handleImage,
  image,
  uploading,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Your name</label>
          </small>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter your Name"
          />
        </div>

        <div className="form-group p-2">
          <small>
            <label className="text-muted">Your email</label>
          </small>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter your Email"
          />
        </div>
        
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Age</label>
          </small>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="number"
            className="form-control"
            placeholder="Enter your Age"
          />
        </div>

        
        <div className="form-group p-2">
          <label className="text-muted">Profile Picture</label>
          <input
            onChange={handleImage}
            type="file"
            accept="image/*"
            className="form-control"
          />
        
          {uploading ? <CameraOutlined className="mt-2" /> : null}
        </div>

        <div className="form-group p-2">
          <button
            disabled={
              profileUpdate ? loading :
              !name || !email || !age 
            }
            className="btn btn-primary col-12"
          >
            {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateForm;

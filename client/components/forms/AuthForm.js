import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
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
  page,
  username,
  setUsername,
  about,
  setAbout,
  profileUpdate,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        {page !== "login" && (
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
        )}

        <div className="form-group p-2">
          <small>
            <label className="text-muted">Email Address</label>
          </small>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            placeholder="Enter your Email"
            disabled={profileUpdate}
          />
        </div>

        {page !== "login" && (
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
        )}

        <div className="form-group p-2">
          <small>
            <label className="text-muted">Password</label>
          </small>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            placeholder="Enter your Password"
            disabled={profileUpdate}
          />
        </div>

        {/* question */}
        {/* {page !== "login" && ( */}
          <>
            {/* <div className="form-group p-2">
              <small>
                <label className="text-muted">Pick a question</label>
              </small>
              <select className="form-control">
                <option>What is your favourite color?</option>
                <option>What is your Best friend name?</option>
                <option>What city you were born?</option>
              </select>

              <small className="form-text text-muted">
                You can use this to reset your password if you forgotten
              </small>
            </div> */}
            {/* wirte answer */}
            {/* <div className="form-group p-2">
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Write your answer here"
              />
            </div> */}
          </>

          
        {/* )} */}
        <div className="form-group p-2">
          <button
            disabled={
              profileUpdate ? loading :
              page === "login"
                ? !email || !password
                : !name || !email || !password || !age 
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

export default AuthForm;

const AuthForm = ({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  name,
  setName,
  age,
  setAge,
  page,
}) => {
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {page === "register" && (
        <>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
};

export default AuthForm;

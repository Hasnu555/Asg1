import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context"; // Ensure this path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`http://localhost:5000/login`, {
        email,
        password,
      });
      setState({
        user: data.user,
        token: data.token,
      });
      window.localStorage.setItem("auth", JSON.stringify(data));
      document.cookie = `token=${data.token}`;
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("An error occurred");
      }
      setLoading(false);
    }
  };

  if (state && state.token) {
    router.push("/");
    return null;
  }

  return (
    <div className="container-fluid auth-container">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div>

      <div className="row py-5 auth-row">
        <div className="col-md-6 offset-md-3 auth-col">
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            page="login"
          />
        </div>
      </div>

      <div className="row">
        <div className="col text-center">
          <p className="text-light">
            Not yet registered? <Link href="/register">Register</Link>
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col text-center">
          <Link className="text-danger" href="/forgot-password">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

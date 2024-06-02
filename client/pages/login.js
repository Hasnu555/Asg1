import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

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
      const { data } = await axios.post(
        `http://localhost:5000/login`,
        {
          email,
          password,
        }
      );
      // Update context state with user and token
      setState({
        user: data.user,
        token: data.token,
      });
      // Save token in local storage
      localStorage.setItem("token", data.token);
      // Redirect to dashboard after successful login
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

  // Redirect to home page if user is already logged in
  if (state && state.token) router.push("/");

  return (
    <div className="container-fluid">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
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
        <div className="col">
          <p className="text-center">
            Not yet registered?{" "}
            <Link href="/register">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="row">
        <div className="col">
          <p className="text-center">
            <Link className="text-danger" href="/forgot-password">
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

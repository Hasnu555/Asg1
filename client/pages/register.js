import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (ok) {
      router.push("/login");  // Redirect to login page
    }
  }, [ok, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`http://localhost:5000/signup`, {
        name,
        email,
        password,
        age,
      });
      if (data.ok) {
        setOk(true);
        toast.success("Registration successful. Redirecting...");
      } else {
        toast.error("Registration failed.");
      }
      setName("");
      setEmail("");
      setPassword("");
      setAge("");
    } catch (err) {
      toast.error(err.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (state && state.token) {
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="container-fluid">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Register</h1>
        </div>
      </div>
      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            name={name}
            setEmail={setEmail}
            setPassword={setPassword}
            setAge={setAge}
            loading={loading}
          />
        </div>
      </div>
      <Modal
        title="Congratulations!"
        visible={ok}
        onCancel={() => setOk(false)}
        footer={null}
      >
        <p>You have successfully registered.</p>
        <Link href="/login">Login</Link>
      </Modal>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Already registered? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

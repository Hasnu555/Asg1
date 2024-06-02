import { useContext, useEffect } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!state || !state.token) {
      router.push("/login");
    }
  }, [state, router]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="display-1 text-center py-5">Home Page</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;

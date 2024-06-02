import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [current, setCurrent] = useState(""); // to store the path name for active links
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
    <nav
      className="nav d-flex justify-content-between"
      style={{ backgroundColor: "purple" }}
    >
      <Link href="/" className="nav-link text-light logo">
        <Avatar src={"/images/logoL.png"} className="logo" />
      </Link>

      {state !== null ? (
        <>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle text-light"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {state && state.user && state.user.name}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <Link
                  href="/user/dashboard"
                  className={`nav-link dropdown-item ${
                    current === "/user/dashboard" && "active"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/user/userprofile"
                  className={`nav-link dropdown-item ${
                    current === "/user/userprofile" && "active"
                  }`}
                >
                  User Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/user/profile/update"
                  className={`nav-link dropdown-item ${
                    current === "/user/profile/update" && "active"
                  }`}
                >
                  Profile
                </Link>
              </li>
              <li>
                <a
                  onClick={logout}
                  className="nav-link dropdown-item "
                  style={{ cursor: "pointer" }}
                >
                  Logout{" "}
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : null}
    </nav>
  );
};

export default Nav;

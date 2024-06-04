import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "antd";
import { UserContext } from "../context"; // Ensure this path is correct

const Nav = () => {
  const [current, setCurrent] = useState(""); // to store the path name for active links
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    setCurrent(window.location.pathname);
  }, [router.pathname]);

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  const handleNavigation = (path) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  return (
    <nav
      className="nav d-flex justify-content-between"
      style={{ backgroundColor: "purple" }}
    >
      <Link href="/" legacyBehavior>
        <a className="nav-link text-light logo">
          <Avatar src={"/images/logoL.png"} className="logo" />
        </a>
      </Link>

      <div className="d-flex align-items-center">
        <a
          className="nav-link text-light"
          onClick={() => handleNavigation("/Groups/index")}
        >
          <Avatar src={"/images/group.png"} className="logo" />
        </a>
        {state !== null ? (
          <>
            <Link href="/user/userprofile" legacyBehavior>
              <a className="nav-link text-light">
                <Avatar
                  src={
                    state.user && state.user.image
                      ? state.user.image
                      : "/images/profile.png"
                  }
                />
              </a>
            </Link>
            <div className="dropdown ms-3">
              <button
                className="btn dropdown-toggle text-light"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {state && state.user && state.user.name}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link href="/user/profile/update" legacyBehavior>
                    <a
                      className={`nav-link dropdown-item ${
                        current === "/user/profile/update" && "active"
                      }`}
                    >
                      Edit Profile
                    </a>
                  </Link>
                </li>
                <li>
                  <a
                    onClick={logout}
                    className="nav-link dropdown-item"
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Nav;

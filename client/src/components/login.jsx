import { useDebugValue, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  // check if already logged in and has valid token. If token expired, clear localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && tokenValid(token)) {
      const checkAuthorization = async () => {
        try {
          const res = await axios.get("http://localhost:4000/login/", {
            headers: {
              Authorization: `Bearer ${token}`, // Correct Authorization header
            },
          });

          if (res.data.authorized) {
            navigate("/home"); // Redirect to home if  authorized
          } else {
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error during authorization check:", error);
          navigate("/login"); // Redirect to login on any error
        }
      };

      checkAuthorization();
    }
  }, [navigate]); // Add navigate as a dependency

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data being sent:", userData);
    try {
      const res = await axios.post("http://localhost:4000/login/", userData);
      console.log("idhar aya", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      console.log("token : ", localStorage.getItem("token"));
      navigate("/home");
      // continue here
    } catch (error) {
      if (error.response?.status != 200) {
        console.log("yahan: ", error.message);
        setErrorMessage(
          error.response?.data?.message || "An error occured. Please try again."
        );
      }
    }
  };

  return (
    <>
      <div className="container">
        <h2>Welcome !</h2>
        <form>
          <input
            type="text"
            name="email"
            value={userData.email}
            onChange={handleChange}
            id="Email"
            placeholder="Email"
          />{" "}
          <br />
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            id="password"
            placeholder="Password"
          />{" "}
          <br />{" "}
          <input
            type="submit"
            name="submit"
            value="Login"
            onClick={handleSubmit}
            id="submit"
          />
          <p style={{ color: "red" }}>{errorMessage}</p>
          <p>
            Don't have an account ? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;

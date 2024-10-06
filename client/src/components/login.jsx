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
    const availableToken = localStorage.getItem("token");
    if (availableToken && tokenValid(availableToken)) {
      navigate("/home");
    } else {
      localStorage.clear();
    }
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (userData) => {
    try {
      const res = await axios.post("http:/localhost:4000/login/", userData);
      localStorage.setItem("payload", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("username", res.data.username);
      navigate("/home");
      // continue here
    } catch (error) {
      if (error.response?.status != 200) {
        console.log("yahan: ", error);
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

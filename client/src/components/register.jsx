import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    grade: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await backend to approve login
      const res = await axios.post("http://localhost:4000/register/", userData);
      //store response token, userId, username on client
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("username", res.data.username);
      // redirect to /home
      navigate("/home");
    } catch (error) {
      if (error.response?.status != 201) {
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
        <h2>Welcome {userData.username} !</h2>
        <form>
          <input
            value={userData.username}
            onChange={handleChange}
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            required
          />{" "}
          <br />
          <input
            value={userData.email}
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />{" "}
          <br />
          <input
            value={userData.password}
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />{" "}
          <br />
          <select
            id="grade"
            name="grade"
            defaultValue={""}
            value={userData.grade}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select
            </option>
            <option value="graduate">Graduate</option>
            <option value="undergraduate">Undergraduate</option>
            <option gradevalue="high school">High School</option>
            <option value="middle school">Middle School</option>
          </select>{" "}
          <br />
          <input
            type="submit"
            value="Register"
            name="submit"
            id="submit"
            onClick={handleSubmit}
          />
          <p style={{ color: "red" }}>{errorMessage}</p>
          <p>
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;

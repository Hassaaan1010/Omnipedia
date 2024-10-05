import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Register from "./components/register";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="*" element={<Navigate replace to={"/register"} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// route components
import Register from "./components/register";
import Login from "./components/login";

import "./App.css";

// error handlers
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

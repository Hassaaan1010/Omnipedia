import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// route components
import Register from "./components/register";
import Login from "./components/login";
import Home from "./components/home";

import Subjects from "./components/subjects";
import Subject from "./components/subject";
import CreateSubject from "./components/createSubject";

import Posts from "./components/posts";
import Post from "./components/post";
import CreatePost from "./components/createPost";
import "./App.css";

// error handlers
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Topics from "./components/topics";
import Topic from "./components/topic";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            {/* page for list of subjects */}
            <Route path="/subjects" element={<Subjects />} />
            {/* singular subject view */}
            <Route path="/subject/:id" element={<Subject />} />
            {/* create subject */}
            <Route path="/subjects/create" element={<CreateSubject />} />

            <Route path="/posts" element={<Posts />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/posts/create/:topicId" element={<CreatePost />} />

            <Route path="/topic" element={<Topics />} />
            <Route path="/topic/:subjectId/:topicId" element={<Topic />} />
            {/* <Route path="/topics/create" element={} /> */}
            {/* <Route path="*" element={<Navigate replace to="/login" />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

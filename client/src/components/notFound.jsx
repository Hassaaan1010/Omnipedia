import React from "react";
import Navbar from "./navbar";
import { useState, useEffect } from "react";
import { tokenValid } from "../utils/tokenValidation";
const NotFoundPage = () => {
  return (
    <>
      <a
        href="/"
        className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
      >
        <h1>Omnipedia</h1>
      </a>
      <div className="container text-center mt-5">
        <h1 className="display-1">404</h1>
        <h2 className="mt-3">Page Not Found</h2>
        <p className="lead">
          Sorry, the page you are looking for does not exist.
        </p>
        <a href="/home" className="btn btn-primary mt-4">
          Go Back to Home
        </a>
      </div>
    </>
  );
};

export default NotFoundPage;

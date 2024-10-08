import React from "react";
import Navbar from "./navbar";

const NotFoundPage = () => {
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  // authorization
  useEffect(() => {
    // authorization
    if (token && tokenValid(token)) {
      const checkAuthorization = async () => {
        try {
          const res = await axios.get("http://localhost:4000/home/", {
            headers: {
              Authorization: `Bearer ${token}`, // Correct Authorization header
            },
          });

          if (res.data.authorized) {
            console.log("auth :", res.data.authorized);
            setTokenAuthorized(true);
          }
        } catch (error) {
          console.error("Error during authorization check:", error);
          setTokenAuthorized(false);
          localStorage.clear();
        }
      };

      checkAuthorization();
    } else {
      setTokenAuthorized(false);
      localStorage.clear();
    }
  }, [token]); // Add token as a dependency

  return (
    <>
      <Navbar authorized={tokenAuthorized}></Navbar>
      <div className="container text-center mt-5">
        <h1 className="display-1">404</h1>
        <h2 className="mt-3">Page Not Found</h2>
        <p className="lead">
          Sorry, the page you are looking for does not exist.
        </p>
        <a href="/" className="btn btn-primary mt-4">
          Go Back to Home
        </a>
      </div>
    </>
  );
};

export default NotFoundPage;

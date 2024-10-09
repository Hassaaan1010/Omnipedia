import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Subjects = ({ userId }) => {
  const [response, setResponse] = useState({
    followedSubjects: [],
  });

  useEffect(() => {
    const getSubjects = async () => {
      try {
        console.log("userid", userId);
        const res = await axios.get(
          `http://localhost:4000/subjects/getFollowing/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("resp : ", res);
        setResponse({ followedSubjects: res.data.followedSubjects });
      } catch (error) {
        console.log("Error fetching subjects.", error);
      }
    };
    getSubjects();
  }, [userId]); // Only userId should be in the dependency array

  return (
    <>
      <h2>Followed Subjects</h2>
      <div className="container">
        <ul>
          {response.followedSubjects.map((subject) => {
            return (
              <li key={subject._id}>
                <div>
                  <Link to={`/subject/${subject._id}`}>{subject.name}</Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Subjects;

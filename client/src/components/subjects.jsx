import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Subjects = ({ userId }) => {
  const [response, setResponse] = useState({
    followedSubjects: [],
  });

  useEffect(() => {
    try {
      const getSubjects = async () => {
        console.log("userid", userId);
        const res = await axios.get(
          `http://localhost:4000/subjects/getFollowing/${userId}`
        );
        console.log("resp : ", res.data);
        setResponse({ followedSubjects: res.data.followedSubjects });
      };
      getSubjects();
    } catch (error) {
      console.log("Error fetching subjects.", error);
    }
  }, [userId]);
  console.log(" followed subjs: ", response.followedSubjects);

  // token as a dependency // Add token as a dependency
  return (
    <>
      <h2>Subjects</h2>
      <div className="container">
        <ul>
          {response.followedSubjects.map((subject) => {
            return (
              // Add return here

              <li key={subject._id}>
                <div>
                  <Link to={`/subject/${subject._id}`}>{subject.name}</Link>
                </div>
              </li>
            );
          })}
          <div>
            <li>Sample following Subject 1</li>
          </div>
          <div>
            <li>Sample following Subject 2</li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Subjects;

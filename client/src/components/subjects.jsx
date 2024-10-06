import axios from "axios";
import { Link } from "react-router-dom";
const Subjects = () => {
  return (
    <>
      <h1>Subjects</h1>
      <button>
        <Link to="/subjects/create">Creat a Subject</Link>
      </button>
      useEffect({}, []);
      <div className="container">
        <ul>
          <div>
            <li>Subject 1</li>
          </div>
          <div>
            <li>Subject 2</li>
          </div>
          <div>
            <li>Subject 3</li>
          </div>
          <div>
            <li>Subject 4</li>
          </div>
          <div>
            <li>Subject 5</li>
          </div>
          <div>
            <li>Subject 6</li>
          </div>
          <div>
            <li>Subject 7</li>
          </div>
          <div>
            <li>Subject 8</li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Subjects;

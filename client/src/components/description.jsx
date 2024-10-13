import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Description = ({ topicName, topicId }) => {
  const [description, setDescription] = useState("Loading description...");
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const getDescription = async () => {
        const descriptionResponse = await axios.get(
          `http://localhost:4000/generate/desc/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              topicId: topicId,
              topicName: topicName,
            },
          }
        );
        setDescription(descriptionResponse.data.description);
      };
      getDescription();
    } catch (error) {
      console.log(error);
      if (error.status === 403) {
        navigate("/login");
      }
    }
  }, [topicId, navigate]);

  return (
    <>
      <h2>{topicName.toUpperCase()}</h2>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

export default Description;

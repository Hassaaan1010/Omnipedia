import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import axios from "axios";

const Post = () => {
  <>
    <h1>Title of Post</h1>
    Content:
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo perspiciatis
      labore aliquid sit perferendis explicabo cum minima iusto culpa quaerat
      ipsa debitis voluptatum, voluptatem sunt voluptatibus impedit, aut
      quibusdam placeat?
    </p>
  </>;
};

export default Post;

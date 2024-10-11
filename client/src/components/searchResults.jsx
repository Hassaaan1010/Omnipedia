import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import { tokenValid } from "../utils/tokenValidation";

const SearchResults = () => {
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");
  let queryTokens = searchQuery.split(" ");

  const stopWords = [
    "",
    "a",
    "an",
    "the",
    "in",
    "on",
    "at",
    "and",
    "or",
    "is",
    "was",
    "to",
    "for",
    "no",
    "not",
    "with",
    "by",
    "of",
    "between",
    "",
  ];

  const filteredTokens = queryTokens.filter(
    (word) => !stopWords.includes(word.toLowerCase())
  );

  console.log("tokens :", queryTokens);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get("http://localhost:4000/search", {
        searchTokens: queryTokens,
      });
      console.log("search response", response);
      // i need separate arrays of topics and subjects.
      // topics should have : topicid, subjectid, name, topic_rank
      // subjects should have : subjectid, name, subject_rank
    };
  });

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
      Search results for {searchQuery}
    </>
  );
};

export default SearchResults;

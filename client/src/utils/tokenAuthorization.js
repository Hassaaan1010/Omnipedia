import axios from "axios";
import { tokenValid } from "./tokenValidation";

export const tokenAuthorization = async (token, setTokenAuthorized) => {
  // cannot async/await useEffect. Create internal async function
  const res = await axios.get("http://localhost:4000/subjects/create", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  console.log("response: ", res.data.authorized);
  setTokenAuthorized(res.data.authorized);
  return res.data.authorized;
};

import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createJwtToken = async (user) => {
  const expiresIn = "2h"; // 2 hour life

  console.log("creating token ...", user);
  const payload = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };

  console.log(payload);

  const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  console.log(token);
  return token;
};

// export const verifyToken = async;
/*
// Continuous token refreshing
  {
    //   On successful login, return both an access token and a refresh token.
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken: token, refreshToken };
    //    Create an endpoint to handle refreshing the access token.
    router.post("/refresh", async (req, res) => {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.sendStatus(401);

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        // Create a new access token
        const newAccessToken = generateJWToken(user);
        res.json({ accessToken: newAccessToken });
      });
    });
    //   Frontend Handling: On the frontend, before making requests, check if the access token is still
    //   valid and refresh it if necessary.
  }
*/

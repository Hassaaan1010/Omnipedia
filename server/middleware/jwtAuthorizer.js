/**
 * @file middleware/jwtAuthentication.js
 * @description JWT Authentication middleware
 */

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

/**
 * @function authorizeToken
 * @param {next} - moves on if token authorization is successful.
 * @throws {BadRequest} Throws Bad Request if no token is found for verification.
 * @throws {Unauthorized} Throws Unauthorized if token verification fails.
 * @description This middleware function ensures token passed in as parameter is valid.
 */

export const authorizeToken = (req, res, next) => {
  const token = req.headers.authorization;
  const tokenPart = token && token.split(" ")[1];

  if (!tokenPart) {
    console.log("TOKEN NOT PROVIDED");
    return res
      .status(400)
      .json({ error: "No token provided", authorized: false });
  }

  jwt.verify(tokenPart, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      if (error.message === "jwt expired") {
        console.log(" JWT TOKEN WAS EXPIRED");
        return res
          .status(401)
          .json({ error: "JWT token expired", authorized: false });
      }
      console.log("ERROR IN TOKEN AUTHORIZATION", error.message);
      return res
        .status(401)
        .json({ error: "Failed to authenticate token", authorized: false });
    }
    req.userId = decoded.id;
    next();
  });
};

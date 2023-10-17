import { errorHandler } from "./error.util.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  //To access the cookie data we have to install a package named 'cookie-parser' and then we have to initialize it in the index.js

  const token = req.cookies.access_token;
  if (!token) {
    // next(errorHandler(401, "Unauthorized"));
    return res.status(401).send({
      success: false,
      message: "Unauthorized user !!!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // return next(errorHandler(403, "Forbidden"));
      return res.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }

    req.user = user; //actually in this user, there is only _id of the user. rmember payload of jwt.
    next();
  });
};

import { comparePassword, hashPassword } from "../utils/auth.util.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.util.js";
import jwt from "jsonwebtoken";

//Signup POST
export const signupController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const existingUser = await User.findOne({
      username,
    });
    if (existingUser)
      return res.status(200).send({
        success: true,
        message: "Already Registered please login",
      });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User is created",
    });
  } catch (error) {
    // next(errorHandle(550, 'Error created in signupController')); //it will go to the error middleware in the index.js
    // next(error);
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in signup",
      error: error,
    });
  }
};

//Post Sign-in
export const signinController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({
      email,
    });

    if (!validUser) {
      // return next(errorHandler(404, "User not found!"));
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const validPassword = await comparePassword(password, validUser.password); 
    if (!validPassword) {
      // return next(errorHandler(401, "Invalid email and password!"));
      return res.status(401).send({
        success: false,
        message: "Invalid email and password!",
      });
    }

    const token = jwt.sign({ _id: validUser._id }, process.env.JWT_SECRET);

    //excluding password from res->
    const { password: pass, ...rest } = validUser._doc;

    //access_token can be any thing and httpOnly is for scurity of cookie
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    // next(error);
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error: error,
    });
  }
};

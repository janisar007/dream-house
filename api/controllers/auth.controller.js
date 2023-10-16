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

//Post Google signin ->
export const googleController = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      //excluding password from res->
      const { password: pass, ...rest } = user._doc;

      //access_token can be any thing and httpOnly is for scurity of cookie
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //Other wise we have to create th user->
      //Since password is required field and with google there is no password  from re.body so we have to create a dummy password->
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //this is a 16 character password.
      const hashedPassword = await hashPassword(generatePassword);

      // Sinse username is like this Janisar Akhtar but we want like this janisarakhtar + some random number and string->
      const convertedUsername =
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);

      const newUser = new User({
        username: convertedUsername,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

      //excluding password from res->
      const { password: pass, ...rest } = newUser._doc;

      //access_token can be any thing and httpOnly is for scurity of cookie
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    // next(error);
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Google Login",
      error: error,
    });
  }
};

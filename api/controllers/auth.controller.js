import { hashPassword } from "../utils/auth.util.js";
import User from "../models/user.model.js";

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
    next(error);
  }
};



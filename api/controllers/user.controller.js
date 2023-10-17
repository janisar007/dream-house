import User from "../models/user.model.js";
import { hashPassword } from "../utils/auth.util.js";
import { errorHandler } from "../utils/error.util.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

export const updateUserController = async (req, res, next) => {
  //Here first the control goes to verifyToken function in the utils via user.route.js, there the payload is extracted and and req.user set to payload's user in which there is only _id ->
  if (req.user._id !== req.params.id) {
    // return next(errorHandler(401, "You can only update your own account!"));

    return res.status(401).send({
      success: false,
      message: "You can only update your own account!",
    });

  }

  try {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //this $set is neccessary coz if any of the field will change it will set its new value independently.
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avator: req.body.avator,
        },
      },
      { new: true }
    ); //this new will actually set updated user in updatedUser.

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
     next(error);
  }
};

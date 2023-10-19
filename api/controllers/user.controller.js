import Listing from "../models/listing.model.js";
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
    // next(error);
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating user",
      error: error,
    });
  }
};

export const deleteUserController = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: "You can only delete your own account!",
    });
  }

  try {
    await User.findByIdAndDelete(req.params.id);

    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting user",
      error: error,
    });
  }
};

//Get all listing that the user is created->
export const getUserListingsController = async (req, res, next) => {
  if (req.user._id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });

      res.status(200).json(listings);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in get user listing controller",
        error: error,
      });
    }
  } else {
    // console.log(error);
    return res.status(401).send({
      success: false,
      message: "You can only view your own listings!",
      error: error,
    });
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting user info for contact!",
      error: error,
    });
  }
};

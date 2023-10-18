import Listing from "../models/listing.model.js";

export const createListingController = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating listing",
      error: error,
    });
  }
};

export const deleteListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).send({
      success: false,
      message: "Listing not found!",
    });
  }

  if (req.user._id !== listing.userRef) {
    return res.status(401).send({
      success: false,
      message: "You can only delete your own listing!",
    });
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete listing",
      error: error,
    });
  }
};

export const updateListingController = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).send({
      success: false,
      message: "Listing not found!",
    });
  }

  if (req.user._id !== listing.userRef) {
    return res.status(401).send({
      success: false,
      message: "You can only update your own listing!",
    });
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update listing",
      error: error,
    });
  }
};

export const getListingController = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).send({
        success: false,
        message: "Listing not found!",
      });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting listing",
      error: error,
    });
  }
};

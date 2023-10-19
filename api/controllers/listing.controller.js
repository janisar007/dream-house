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

//this is for search bar
export const getListingsController = async (req, res, next) => {
  try {
    //we want limit number of page coz we are doing pagination here
    //we want start index coz we want to know which page we are in
    //also we ant offer, furnish all data aswell

    //req.query is like req.body or req.params and limit is the name of query. in url you can see the query parameter is started with ?.
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer; //since offer is true or false and if not send in the url then it will be undefined.
    if (offer === undefined || offer === "false") {
      //Here logic is: if offer is not defined or is false that means user wants the listings with offer and without offer. in sort he wants all the listing wheter it has offer or not. so we set offer to search in database for both offer is true and false->
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      //Here login is: if type is not defined or its all=both rent and sale, we should return listing with both->
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt"; //createAt means if sorted is not provided we are going to sort listings as latest ones.

    const order = req.query.order || "desc"; //ascending or desending.

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, //$options: 'i' means do not care about lower and upper case of the words.
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting listings for search bar",
      error: error,
    });
  }
};

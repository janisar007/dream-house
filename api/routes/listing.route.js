import express from 'express';
import { createListingController, deleteListingController, updateListingController, getListingController } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.util.js';
const router = express.Router();

router.post('/create', verifyToken, createListingController);

//its the id of the listing not the user
router.delete('/delete/:id', verifyToken, deleteListingController);

//its the id of the listing not the user
router.post('/update/:id', verifyToken, updateListingController);

//getting info about specific listing for update-listing page ->
//!I am not verifying user here usinf verifyToken coz i want this route for showing listings on the home page as well.
router.get('/get/:id', getListingController);


export default router;
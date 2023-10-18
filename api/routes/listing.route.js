import express from 'express';
import { createListingController, deleteListingController, updateListingController } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.util.js';
const router = express.Router();

router.post('/create', verifyToken, createListingController);

//its the id of the listing not the user
router.delete('/delete/:id', verifyToken, deleteListingController);

//its the id of the listing not the user
router.post('/update/:id', verifyToken, updateListingController);


export default router;
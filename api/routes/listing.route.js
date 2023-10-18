import express from 'express';
import { createListingController, deleteListingController } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.util.js';
const router = express.Router();

router.post('/create', verifyToken, createListingController);
router.delete('/delete/:id', verifyToken, deleteListingController);


export default router;
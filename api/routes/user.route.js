import express from 'express';
import { test, updateUserController, deleteUserController, getUserListingsController, getUserController} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.util.js';

const router = express.Router();

router.get('/test', test);

//first we have to verify user because he want to update his credentials->
router.post('/update/:id',verifyToken, updateUserController);

router.delete('/delete/:id',verifyToken, deleteUserController);

router.get('/listings/:id',verifyToken, getUserListingsController);

//This route is for getting user info for contacting landlord from another users' account. so in order to do so we have to first verify that users' account ->
router.get('/:id', verifyToken, getUserController);


export default router;
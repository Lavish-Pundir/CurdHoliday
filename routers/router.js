import express from 'express';
import { registerUser, loginUser, getAllUsers, getUser, updateUser, deletedUser } from '../controllers/controller.js'; 

import authJWT from '../middleware/auth.js';    

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);

router.route("/getAll").get( authJWT, getAllUsers);

router.route("/getUser/:id").get( authJWT, getUser);

router.route("/update/:id").put( authJWT, updateUser);

router.route("/delete/:id").delete( authJWT, deletedUser);

export default router;

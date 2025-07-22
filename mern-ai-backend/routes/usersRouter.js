const express=require('express');
const { register,login, logout,userProfile, checkAuth}=require('../controllers/usersController');

const usersRouter=express.Router();
const isAuthenticated=require("../middlewares/isAuthenticated");
const { verifyPayment } = require('../controllers/handleRazorPayment');
usersRouter.post("/register",register);
usersRouter.post("/login",login);
usersRouter.post("/logout",logout);
usersRouter.get("/profile",isAuthenticated,userProfile);
usersRouter.get("/auth/check",isAuthenticated,checkAuth);
module.exports=usersRouter;
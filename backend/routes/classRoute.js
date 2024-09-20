const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createClass, joinClass, fecthClass} = require("../controllers/classController");



router.post("/class/create", isAuthenticatedUser, authorizedRoles('admin'), createClass);
router.post("/class/join", isAuthenticatedUser,  joinClass);
//router for fetching the classdetails
router.get('/class/fetch/:classId', isAuthenticatedUser,fecthClass )

module.exports=router
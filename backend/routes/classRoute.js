const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createClass, joinClass } = require("../controllers/classController");



router.post("/class/create", isAuthenticatedUser, authorizedRoles('admin'), createClass);
router.post("/class/join", isAuthenticatedUser,  joinClass);


module.exports=router
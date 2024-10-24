const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createClass, joinClass, fecthClass, fetchAllClasses, fectchUsers} = require("../controllers/classController");



router.post("/create", isAuthenticatedUser, authorizedRoles('admin'), createClass);
router.post("/join", isAuthenticatedUser,  joinClass);
//router for fetching the classdetails
router.get('/fetch/:classId', isAuthenticatedUser,fecthClass )
//router to fetch class details with population
router.get('/fetch', isAuthenticatedUser, fetchAllClasses)
//router for users in a class
router.get('/users/:classId', isAuthenticatedUser, fectchUsers)

module.exports=router
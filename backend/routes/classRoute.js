const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createClass, joinClass, fecthClass, fetchAllClasses, fectchUsers} = require("../controllers/classController");



router.post("/class/create", isAuthenticatedUser, authorizedRoles('admin'), createClass);
router.post("/class/join", isAuthenticatedUser,  joinClass);
//router for fetching the classdetails
router.get('/class/fetch/:classId', isAuthenticatedUser,fecthClass )
//router to fetch class details with population
router.get('/class/fetch', isAuthenticatedUser, fetchAllClasses)
//router for users in a class
router.get('/class/users/:classId', isAuthenticatedUser, fectchUsers)

module.exports=router
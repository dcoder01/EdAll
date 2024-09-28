const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createQuiz } = require("../controllers/taskController");

router.post('/create', isAuthenticatedUser, createQuiz);

module.exports=router
const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createQuiz, fetchWorks } = require("../controllers/taskController");

router.post('/create', isAuthenticatedUser, createQuiz);
router.get('/fetch/all/:classId', isAuthenticatedUser, fetchWorks);

module.exports=router
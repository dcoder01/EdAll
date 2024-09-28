const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createQuiz, fetchWorks, fetchQuizInfo } = require("../controllers/taskController");

router.post('/create', isAuthenticatedUser, createQuiz);
router.get('/fetch/all/:classId', isAuthenticatedUser, fetchWorks);
router.get('/fetch/:quizId', isAuthenticatedUser, fetchQuizInfo);
router.get('/fetch/pending/:classId', isAuthenticatedUser, fetchQuizInfo);

module.exports=router
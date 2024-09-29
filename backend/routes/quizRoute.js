const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createQuiz, fetchWorks, fetchQuizInfo, fetchPendingQuizes, submitQuiz, fetchUserQuizSubmissionInfo, fetchAllUsersQuizSubmissions } = require("../controllers/taskController");

router.post('/create', isAuthenticatedUser, createQuiz);
router.get('/fetch/all/:classId', isAuthenticatedUser, fetchWorks);
router.get('/fetch/:quizId', isAuthenticatedUser, fetchQuizInfo);
router.get('/fetch/pending/:classId', isAuthenticatedUser, fetchPendingQuizes);
router.post('/submit', isAuthenticatedUser, submitQuiz);
router.get('/submission', isAuthenticatedUser, fetchUserQuizSubmissionInfo);
router.get('/submissions/:quizId', isAuthenticatedUser, fetchAllUsersQuizSubmissions);

module.exports=router
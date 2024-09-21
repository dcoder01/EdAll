const express = require("express");
const router = express.Router();
const { createAssignment, submitAssignment, fetchAssignment, fetchPendingAssignments } = require("../controllers/taskController");
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

// Route to upload an assignment
router.post('/create',isAuthenticatedUser, upload.single('file'), createAssignment);

// Route to upload an assignment submission
router.post('/submit',isAuthenticatedUser,  upload.single('file'), submitAssignment);

//route for fetching assignment(isSubmitted)
router.get('/fetch/:assignmentId',isAuthenticatedUser, fetchAssignment )
//fetch pending assignments
router.get('/fetch/pending/:classId', isAuthenticatedUser, fetchPendingAssignments)
module.exports = router;

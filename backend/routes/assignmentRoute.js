const express = require("express");
const router = express.Router();
const { createAssignment, submitAssignment, fetchAssignment, fetchPendingAssignments, fetchAssignmentSubmissions, fetchUserAssignmentSubmissions, downloadAssignment, downloadAssignmentSubmission, getFileExtensionAssignment, getFileExtensionAssignmentSubmission, gradeAssignment } = require("../controllers/taskController");
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { route } = require("./userRoute");

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

//view submissions for an assignment
router.get('/submissions/:assignmentId', isAuthenticatedUser, fetchAssignmentSubmissions)

//fetch assignment submission for paticular assignment of a particular user

router.get('/submission', isAuthenticatedUser, fetchUserAssignmentSubmissions)


//download assignment
router.get('/download/:assignmentId', isAuthenticatedUser, downloadAssignment)
//download submission
router.get('/download/submission/:assignmentId', isAuthenticatedUser, downloadAssignmentSubmission)

//get file extension
router.get('/getFileExtension/:assignmentId', isAuthenticatedUser, getFileExtensionAssignment)

router.get('/submission/getFileExtension/:assignmentId', isAuthenticatedUser, getFileExtensionAssignmentSubmission)

//grading assignment route

router.post('/grade/:assignmentId/:userId', isAuthenticatedUser,gradeAssignment )

// router.get('/test/:assignmentId', isAuthenticatedUser, test);





module.exports = router;

const express = require("express");
const router = express.Router();
const { uploadAssignment, uploadSubmission } = require("../controllers/taskController");
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

// Route to upload an assignment
router.post('/assignments',isAuthenticatedUser, upload.single('file'), uploadAssignment);

// Route to upload an assignment submission
router.post('/submissions',isAuthenticatedUser,  upload.single('file'), uploadSubmission);

module.exports = router;

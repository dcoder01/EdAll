const mongoose = require('mongoose');

const cloudinary = require("../config/cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Assignment = require("../models/assignment");
const AssignmentSubmission = require("../models/assignmentSubmission");
const ErrorHandler = require('../utils/errorhandler');
const classModel = require('../models/classModel');


// Function to handle uploading an assignment--teacher
exports.createAssignment = catchAsyncErrors(async (req, res, next) => {
  const file = req.file;

  // Upload file to Cloudinary
  let fileResult;
  if (file) {
      fileResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
              if (error) {
                  return reject(new ErrorHandler('File upload failed', 500));
              }
              resolve(result);
          }).end(file.buffer);
      });
  }

  const {  classId, title, instructions, marks } = req.body;

  // Validate classId
  const isValidClassId = mongoose.Types.ObjectId.isValid(classId);
  if (!isValidClassId) {
      return next(new ErrorHandler("Invalid Class ID", 404));
  }

  // Find the class
  const requestedClass = await classModel.findById(classId);
  if (!requestedClass) {
      return next(new ErrorHandler("Class not found", 404));
  }

  // Check if the user is the teacher who created the class
  if (!requestedClass.createdBy.equals(req.user._id)) {
      return next(new ErrorHandler("Not authorized", 403));
  }

  // Create new assignment
  const assignment = new Assignment({
      createdBy: req.user._id,
      classId,
      title,
      instructions,
      marks,
      file: fileResult ? fileResult.secure_url : null, // Save Cloudinary file URL
  });

  // Save assignment and add it to the class
  await assignment.save();
  requestedClass.assignments.push(assignment._id);
  await requestedClass.save();

  res.status(201).json({
      success: true,
      data: {
          createdAssignment: assignment,
      },
  });
});

// Function to handle uploading an assignment submission
exports.submitAssignment = async (req, res) => {
  try {
    const file = req.file;

    const requestedAssignment = await Assignment.findById(req.body.assignmentId);
   
    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }).end(file.buffer);
    });
    // console.log("Cloudinary upload result:", result);
    const submissionData = {
      user: req.user._id,
      createdBy: req.body.createdBy,
      classId: req.body.classId,
      assignmentId: req.body.assignmentId,
      submission: result.secure_url,
      grade: req.body.grade,
    };


    const submission = new AssignmentSubmission(submissionData);


    await submission.save();


    requestedAssignment.submissions.push(submission._id);
    await requestedAssignment.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//function for fetching assignment
exports.fetchAssignment = catchAsyncErrors(async (req, res, next) => {
  const assignmentId = req.params.assignmentId;

  // Validate assignment ID
  const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId);
  if (!isValidAssignmentId || !assignmentId) {
    return next(new ErrorHandler("Invalid AssignmentID", 404));
  }

  // Find the requested assignment
  const requestedAssignment = await Assignment.findById(assignmentId);
  if (!requestedAssignment) {
    return next(new ErrorHandler("Invalid AssignmentID", 404));
  }

  // Fetch student's submission on this assignment
  const usersAssignmentSubmission = await AssignmentSubmission.findOne({
    assignmentId,
    user: req.user._id,
  });

  let hasSubmitted = false;
    if (usersAssignmentSubmission) {
      hasSubmitted = true;
    }

  res.json({
    data: {
      assignment: requestedAssignment,
      createdBy: requestedAssignment.createdBy,
      hasSubmitted,
    },
  });
});

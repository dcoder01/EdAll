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

  const { classId, title, instructions, marks } = req.body;

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
      createdBy: requestedAssignment.createdBy,
      classId: req.body.classId,
      assignmentId: req.body.assignmentId,
      submission: result.secure_url,

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

//fetch all pending assignment
exports.fetchPendingAssignments = catchAsyncErrors(async (req, res, next) => {

  const classId = req.params.classId;
  const isValidClassId = mongoose.Types.ObjectId.isValid(classId);
  if (!isValidClassId) { return next(new ErrorHandler("Invalid ClassId"), 404) };
  const allAssignments = await Assignment.find({ classId }, "_id title")

  // const allSubmissions = await AssignmentSubmission.find({classId}, "assignmentId")
  const allSubmissions = await AssignmentSubmission.find({ classId, user: req.user._id }, "assignmentId");


  if (!allAssignments || !allSubmissions)
    return next(new ErrorHandler("Invalid ClassId"), 404);
  let pendingAssignments = [];
  allAssignments.forEach((assignment) => {
    if (
      !allSubmissions.find(sub => sub.assignmentId.equals(assignment._id))
    )
      pendingAssignments.push(assignment);
  })
  res.status(200).json({
    success: true,
    data: {
      pendingAssignments
    }
  })

})


//fetch all assignment submissions -- admin 
//it for the teacher to view submissions for particular assignment
exports.fetchAssignmentSubmissions = catchAsyncErrors(async (req, res, next) => {

  const assignmentId = req.params.assignmentId;
  const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId);

  if (!isValidAssignmentId) {
    return next(new ErrorHandler("Invalid assignment ID"), 404)
  }
  const assignment = await Assignment.findById(
    assignmentId
  ).populate([
    {

      path: "submissions",
      select: "user createdBy assignmentId submission createdAt",
      populate: { path: "user", select: "id name email picture" },

    }
  ])
  if (!assignment) {
    return next(new ErrorHandler("Invalid assignment Id"), 404);

  }

  //only teacher can make the request
  if (!assignment.createdBy.equals(req.user._id)) {
    return next(new ErrorHandler("Not authorsized"), 401);
  }
  res.status(200).json({
    success: true,
    data: {
      submissions: assignment.submissions,
    }
  })
})

//fetch assignment submission for user
exports.fetchUserAssignmentSubmissions = catchAsyncErrors(async (req, res, next) => {

  const assignmentId = req.query.assignmentId;
  const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId);
  const userId = req.query.userId;


  if (!isValidAssignmentId) {
    return next(new ErrorHandler("Invalid assignment ID"), 404)
  }
  const assignmentSubmission = await AssignmentSubmission.findOne({
    assignmentId,
    user: userId

  }).populate("user", "name email")
  if (!assignmentSubmission) {
    return next(new ErrorHandler("Invalid assignment Id"), 404);

  }

  //only teacher can make the request
  //student can view his assignment submission only
  if (
    !assignmentSubmission.createdBy.equals(req.user._id) &&
    !assignmentSubmission.user.equals(req.user._id)
  ) {
    return next(new ErrorHandler("Not authorized", 401));
  }

  res.status(200).json({
    success: true,
    data: {
      submission: assignmentSubmission,
    }
  })
})

//download assignment
exports.downloadAssignment = catchAsyncErrors(async (req, res, next) => {

  const assignmentId = req.params.assignmentId;
  const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId);



  if (!isValidAssignmentId) {
    return next(new ErrorHandler("Invalid assignment ID"), 404)
  }
  const requestedAssignment = await Assignment.findById(assignmentId);
  if (!requestedAssignment) {
    return next(new ErrorHandler("Invalid assignment ID"), 404)
  }

  const fileLink=requestedAssignment.file;
  if(!fileLink)  return next(new ErrorHandler("Assignment file not found", 404));
  res.status(200).redirect(fileLink);
 

  
})
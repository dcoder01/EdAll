const mongoose = require('mongoose');
const path = require("path");
const https = require("https");
const { URL } = require('url');
const cloudinary = require("../config/cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Assignment = require("../models/assignment");
const AssignmentSubmission = require("../models/assignmentSubmission");
const QuizModel = require("../models/quizModel");
const QuizSubmission = require("../models/quizSubmission");

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
exports.submitAssignment = catchAsyncErrors(async (req, res, next) => {

  const file = req.file;
  const { assignmentId, classId } = req.body;

  // Check if assignmentId is valid
  const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId);
  if (!isValidAssignmentId) {
    return next(new ErrorHandler("Invalid assignment ID", 404));
  }

  // Check if classId is valid
  const isValidClassId = mongoose.Types.ObjectId.isValid(classId);
  if (!isValidClassId) {
    return next(new ErrorHandler("Invalid class ID", 404));
  }
  const requestedClass = await classModel.findById(classId);
  if (!requestedClass) {
    return next(new ErrorHandler("Invalid class ID", 404));
  }

  if (requestedClass.createdBy.equals(req.user._id)) {
    return next(new ErrorHandler("you cannot submit", 401));
  }
  const requestedAssignment = await Assignment.findById(assignmentId);
  if (!requestedAssignment) {
    return next(new ErrorHandler("Invalid AssignmentId", 400));

  }
  if (!req.file) return next(new ErrorHandler("Please Select a file", 400));

  const hasSubmitted = await AssignmentSubmission.findOne({
    user: req.user._id,
    assignmentId,
  });
  if (hasSubmitted) {
    return next(new ErrorHandler("Already submitted", 400))
  }

  const fileName = `${req.user.name.replace(/\s+/g, '_')}_Assignment_${assignmentId}`;
  // Upload file to Cloudinary
  const fileResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      resource_type: 'auto',
      public_id: fileName,
    }, (error, result) => {
      if (error) {
        return reject(new ErrorHandler('File upload failed', 500));
      }
      resolve(result);
    }).end(file.buffer);
  });
  // console.log("Cloudinary upload result:", result);
  const submission = await AssignmentSubmission.create({
    user: req.user._id,
    createdBy: requestedClass.createdBy,
    classId,
    assignmentId,
    submission: fileResult.secure_url,

  });


  requestedAssignment.submissions.push(submission._id);

  await requestedAssignment.save();


  res.status(201).json(submission);

})


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
  if (!isValidClassId) { return next(new ErrorHandler("Invalid ClassId", 404)) };
  const allAssignments = await Assignment.find({ classId }, "_id title")

  // const allSubmissions = await AssignmentSubmission.find({classId}, "assignmentId")
  const allSubmissions = await AssignmentSubmission.find({ classId, user: req.user._id }, "assignmentId");


  if (!allAssignments || !allSubmissions)
    return next(new ErrorHandler("Invalid ClassId", 404));
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
    return next(new ErrorHandler("Invalid assignment ID", 404))
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
    return next(new ErrorHandler("Invalid assignment Id", 404));

  }

  //only teacher can make the request
  if (!assignment.createdBy.equals(req.user._id)) {
    return next(new ErrorHandler("Not authorsized", 401));
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
    return next(new ErrorHandler("Invalid assignment ID", 404))
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
    return next(new ErrorHandler("Invalid assignment ID", 404))
  }
  const requestedAssignment = await Assignment.findById(assignmentId);
  if (!requestedAssignment) {
    return next(new ErrorHandler("Invalid assignment ID", 404))
  }

  const fileLink = requestedAssignment.file;
  if (!fileLink) return next(new ErrorHandler("Assignment file not found", 404));


  // Extract the file extension and original filename
  const fileExtension = path.extname(fileLink);
  const fileName = `${requestedAssignment.title}${fileExtension}`;

  // Download the file from Cloudinary or any other service
  https.get(fileLink, (fileStream) => {
    // Set headers to prompt file download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    fileStream.pipe(res);
  }).on('error', (err) => {
    console.error("Error downloading file:", err);
    res.status(500).json(
      {
        message: "Error downloading file"
      });
  });


})

//download submission of assignment
exports.downloadAssignmentSubmission = catchAsyncErrors(async (req, res, next) => {

  let userId;
  //this is for finding the assginment
  //alternate directly by submission id
  if (req.query && req.query.userId) {
    userId = req.query.userId;
  }
  else userId = req.user._id;

  const assignmentId = req.params.assignmentId;
  const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId);
  if (!isValidAssignmentId) {
    return next(new ErrorHandler("Invalid assignment ID", 404))
  }

  const requestedAssignment = await Assignment.findById(assignmentId);
  if (!requestedAssignment) {
    return next(new ErrorHandler("Invalid assignment ID", 404))
  }
  const usersAssignmentSubmission = await AssignmentSubmission.findOne({
    assignmentId,
    user: userId,
  });
  //creator and user only can see not other users
  if (
    !usersAssignmentSubmission.user.equals(req.user._id) &&
    !usersAssignmentSubmission.createdBy.equals(req.user._id)
  )
    return next(new ErrorHandler("Not authorized", 401));

  const fileLink = usersAssignmentSubmission.submission;
  if (!fileLink) return next(new ErrorHandler("Assignment file not found", 404));


  const parsedUrl = new URL(fileLink);
  const fileName = path.basename(parsedUrl.pathname);

  https.get(fileLink, (fileStream) => {
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    fileStream.pipe(res);
  }).on('error', (err) => {
    console.error("Error downloading file:", err);
    res.status(500).json({ message: "Error downloading file" });
  });




})





// --------QUIZ-----------------


//create quiz
exports.createQuiz = catchAsyncErrors(async (req, res, next) => {
  const { classId, questions, title } = req.body;
  const user = req.user._id;

  const requestedClassByUser = await classModel.findById(classId);

  //creator of classroom to create the Quiz
  if (!requestedClassByUser.createdBy.equals(user)) {
    return next(new ErrorHandler("Not authorized", 401));
  }
  const createdQuiz = await QuizModel.create({
    title,
    createdBy: req.user._id,
    classId,
    questions,
  });
  await requestedClassByUser.quizzes.push(createdQuiz);
  await requestedClassByUser.save();
  res.status(200).json({
    success: true,

  })
})


//fetch all assignments and quizzes
exports.fetchWorks = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.classId;

  const isValidClassId = mongoose.Types.ObjectId.isValid(classId);

  if (!isValidClassId) {
    return next(new ErrorHandler("Invalid classId", 404))
  }
  const allworks = await classModel.findById(classId).populate(
    "quizzes assignments"
  );

  if (!allworks) {
    return next(new ErrorHandler("Invalid classId", 404))

  }
  allworks.assignments.sort((a, b) => {
    if (
      //if return neg the a comes first
      new Date(a.createdAt).toISOString() >
      new Date(b.createdAt).toISOString()
    )
      return -1;
    else return 1;
  })
  allworks.quizzes.sort((a, b) => {
    if (
      //if return neg the a comes first
      new Date(a.createdAt).toISOString() >
      new Date(b.createdAt).toISOString()
    )
      return -1;
    else return 1;
  })

  res.status(200).json({
    success: true,
    data: {
      assignments: allworks.assignments,
      quizzes: allworks.quizzes,
      createdBy: allworks.createdBy//class' creator
    }
  })
})

//fetch individual quiz along with the user submission

exports.fetchQuizInfo = catchAsyncErrors(async (req, res, next) => {
  const quizId = req.params.quizId;

  const isValidQuizId = mongoose.Types.ObjectId.isValid(quizId);

  if (!isValidQuizId) {
    return next(new ErrorHandler("Invalid quizId", 404))
  }
  const requestedQuiz = await QuizModel.findById(quizId);

  if (!requestedQuiz) {
    return next(new ErrorHandler("Invalid quizId", 404))

  }

  //find the submission

  const quizSubmissionByUser = await QuizSubmission.find({
    user: req.user._id,
    quizId,

  })
  let hasSubmitted = false;
  if (quizSubmissionByUser && quizSubmissionByUser.length > 0) {
    hasSubmitted = true;
  }

  //calculate the students score in this quiz (auto-grading)
  let totalQuizScore = 0;
  requestedQuiz.questions.forEach(
    (ques) => (totalQuizScore = totalQuizScore + ques.correctMarks)
  );


  res.status(200).json({
    data: {
      totalQuizScore,
      totalUserScore: hasSubmitted ? quizSubmissionByUser.totalScore : 0,
      hasSubmitted,
      title: requestedQuiz.title,
      createdBy: requestedQuiz.createdBy,
      questions: requestedQuiz.questions,
      submission: quizSubmissionByUser ? quizSubmissionByUser : [],
    },
  });
})

//fetch pending mcq quizes by the student
exports.fetchPendingQuizes = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.classId;
  const isValidClassId = mongoose.Types.ObjectId.isValid(classId);

  if (!isValidClassId) {
    return next(new ErrorHandler("Invalid classId", 404));
  }

  const allQuizzes = await QuizModel.find(
    {
      classId,
    },
    "_id title"
  );
  const allSubmissions = await QuizSubmission.find(
    {
      classId, //TODO:add user aslo
    },
    "quizId"
  );
  if (!allQuizzes) {

    return next(new ErrorHandler("Invalid classId", 404));
  }
  let pendingQuizzes = [];
  allQuizzes.forEach((quiz) => {
    if (!allSubmissions.find((sub) => sub.quizId.equals(quiz._id)))
      pendingQuizzes.push(quiz); //--find so no need of break statemet:)
  });
  res.json({
    data: {
      pendingQuizzes,
    },
  });

})



//submit quiz
exports.submitQuiz = catchAsyncErrors(async (req, res, next) => {

  const {quizId} = req.body;
  const userSubmittedResponse = req.body.submission;
  const isValidQuizId = mongoose.Types.ObjectId.isValid(quizId);
  
  if (!isValidQuizId) {
    return next(new ErrorHandler("Invalid quiz ID", 404));
  }
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) {
    return next(new ErrorHandler("Quiz not found", 404));
  }



  // Check if the user is the quiz creator (creator can't submit)
  if (quiz.createdBy.equals(req.user._id)) {
    return next(new ErrorHandler("Quiz creator cannot submit answers", 400));
  }

  // Check if the user has already submitted the quiz
  const existingSubmission = await QuizSubmission.findOne({
    user: req.user._id,
    quizId,
  });
  if (existingSubmission) {
    return next(new ErrorHandler("Quiz has already been submitted", 400));
  }

  // Auto-grade the quiz submission

  const numberOfQuestions = quiz.questions.length;
  const submission= Array(numberOfQuestions).fill(-1);
  let totalScore = 0;
  quiz.questions.forEach((question, ind) => {
    let marksScored = 0;
    //userSubmittedResponse is an array coming from frntend
    if (userSubmittedResponse[ind] === question.correctOption) {
      marksScored = question.correctMarks;
    } else if (
      //-1 means no subission-- 0 marks
      userSubmittedResponse[ind] !== -1 &&
      userSubmittedResponse[ind] !== question.correctOption
    ) {
      marksScored = question.incorrectMarks;
    }
    totalScore += marksScored;
    submission[ind]= {
      questionNumber: ind,
      option: userSubmittedResponse[ind],
      marksScored,
    };
  });

  const newSubmission = await QuizSubmission.create({
    user: req.user._id,
    createdBy: quiz.createdBy,
    classId: quiz.classId,
    quizId,
    submission,
    totalScore,
  });

  quiz.submissions.push(newSubmission._id);
  await quiz.save();


  res.status(201).json({
    success: true,
    data: {
      submission: newSubmission,
    },
  });
})
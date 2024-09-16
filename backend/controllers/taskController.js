

const cloudinary = require("../config/cloudinary");
const Assignment = require("../models/assignment");
const AssignmentSubmission = require("../models/assignmentSubmission");


// Function to handle uploading an assignment
const uploadAssignment = async (req, res) => {
  try {
    const file = req.file;

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }).end(file.buffer);
    });

    const assignment = new Assignment({
      createdBy: req.body.createdBy,
      classId: req.body.classId,
      title: req.body.title,
      instructions: req.body.instructions,
      marks: req.body.marks,
      file: result.secure_url,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to handle uploading an assignment submission
const uploadSubmission = async (req, res) => {
  try {
    const file = req.file;

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }).end(file.buffer);
    });

    const submission = new AssignmentSubmission({
      user: req.body.user,
      createdBy: req.body.createdBy,
      classId: req.body.classId,
      assignmentId: req.body.assignmentId,
      submission: result.secure_url,
      grade: req.body.grade,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  uploadAssignment,
  uploadSubmission
};

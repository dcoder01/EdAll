const mongoose = require("mongoose");


const assignmentSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    submission: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
    },
  },
  { timestamps: true }
);

const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
module.exports = AssignmentSubmission;

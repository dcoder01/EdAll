const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    title: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    marks: {
      type: Number,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssignmentSubmission',
      },
    ],
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;

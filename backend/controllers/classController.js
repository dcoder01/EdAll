const mongoose = require('mongoose');

const cloudinary = require("../config/cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Assignment = require("../models/assignment");
const AssignmentSubmission = require("../models/assignmentSubmission");
const ErrorHandler = require('../utils/errorhandler');
const classModel = require('../models/classModel');
const userModel = require('../models/userModel');

exports.createClass = catchAsyncErrors(async (req, res, next) => {
    const { className, subject, room } = req.body;
    //search if a class already exists with the given class name
    const exisitingClass = await classModel.findOne({
        className,
        createdBy: req.user._id,
    });

    if (exisitingClass) {
        return next(new ErrorHandler(`Class with name ${className} already exists. Please try with a different name`, 400))
    }
    const newClass = await classModel.create({
        createdBy: req.user._id,
        className,
        subject,
        room,
        users: [req.user._id],
      });
      const user=await userModel.findById(req.user._id);
      user.createdClasses.push(newClass._id);
      await user.save();
     

      res.status(200).json({
        success: true,
        class:newClass
    })

})

// TODO:if i want to regulate the users to join the classes
//basically like batches use batch in schema and verify to join the class
//batch should be in the class and user to matchs
//bacth will be assigned by teacher may be a special number


//jooining class user
exports.joinClass= catchAsyncErrors(async (req, res, next)=>{
    const requestedClassId = req.body.classId;
    const isValidClassId = mongoose.Types.ObjectId.isValid(requestedClassId);
    if (!isValidClassId) {
      
      return next(new ErrorHandler("Invalid classId", 404))
    }

       const requestedClass = await classModel.findById(requestedClassId);

    //if requested class does not exist
    if (!requestedClass) {
        return next(new ErrorHandler("Invalid classId", 404))
    }
    if (requestedClass.createdBy == req.user._id) {
        return next(new ErrorHandler("Teacher cannot make sumission", 400))
      }

      const currentUser = await userModel.findById(req.user._id);

    //check if user has already joined the clasroom
    if (currentUser.joinedClasses.includes(requestedClassId)) {
        return next(new ErrorHandler("You have already joined the class", 400))

    }
     //all checks are performed, now user can join the classroom
     currentUser.joinedClasses.push(requestedClass._id);
     currentUser.save();
 
     requestedClass.users.push(currentUser);
     requestedClass.save();
 
     
     res.status(200).json({
        success: true,
        joinedClass: requestedClass,
    })
})
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
    const user = await userModel.findById(req.user._id);
    user.createdClasses.push(newClass._id);
    await user.save();


    res.status(200).json({
        success: true,
        class: newClass
    })

})

// TODO:if i want to regulate the users to join the classes
//basically like batches use batch in schema and verify to join the class
//batch should be in the class and user to matchs
//bacth will be assigned by teacher may be a special number


//jooining class user
exports.joinClass = catchAsyncErrors(async (req, res, next) => {
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
        return next(new ErrorHandler("Teacher cannot join class", 401))
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


//fetch class details--
exports.fecthClass = catchAsyncErrors(async (req, res, next) => {
    const classId = req.params.classId;


    const isValidClassId = mongoose.Types.ObjectId.isValid(classId);

    if (!isValidClassId) {


        return next(new ErrorHandler("Invalid classId", 404))
    }
    const classDetails = await classModel.findById(
        classId

    );

    if (!classDetails) {
        return next(new ErrorHandler("Invalid classId", 404))

    }
    if (!classDetails.users.includes(req.user._id)
        && !classDetails.createdBy.equals(req.user._id)) {
        return next(new ErrorHandler("Invalid classId", 404))

    }
    res.status(200).json({
        createdBy: classDetails.createdBy,
        className: classDetails.className,
        subject: classDetails.subject,
        room: classDetails.room,
    });
})


//fetch all classes with population
exports.fetchAllClasses = catchAsyncErrors(async (req, res, next) => {
    const userClasses = await User.findById(req.user.id, "createdClasses joinedClasses")
        .populate([
            {
                path: "createdClasses",
                select: "createdBy subject className room createdAt",
                populate: {
                    path: "createdBy",
                    select: "_id name",
                },
            },
            {
                path: "joinedClasses",
                select: "createdBy subject className room createdAt",
                populate: {
                    path: "createdBy",
                    select: "_id name",
                },
            },
        ]);
    if (!userClasses) {
        return next(new ErrorHandler("User not found", 404));
    }

    userClasses.createdClasses.sort((a, b) => {
        if (
            //if return neg the a comes first
            new Date(a.createdAt).toISOString() >
            new Date(b.createdAt).toISOString()
        )
            return -1;
        else return 1;
    });
    userClasses.joinedClasses.sort((a, b) => {
        if (
            new Date(a.createdAt).toISOString() >
            new Date(b.createdAt).toISOString()
        )
            return -1;
        else return 1;
    });

    res.status(200).json({
        success: true,
        classes: userClasses,
    });
})

//fetch users in a class

exports.fectchUsers = catchAsyncErrors(async (req, res, next) => {
    const classId = req.params.classId;


    const isValidClassId = mongoose.Types.ObjectId.isValid(classId);

    if (!isValidClassId) {


        return next(new ErrorHandler("Invalid classId", 404))
    }
    const usersInClass = await classModel.findById(
        classId,
        "createdBy users"

    ).populate([
        {
            path: "users",
            select: "email name picture"

        },
        {
            path: "createdBy",
            select: "email name picture"
        }
    ])
   
    
    if (!usersInClass) {
        return next(new ErrorHandler("Invalid classId", 404))

    }

    res.status(200).json({
        success: true,
        data: {
            usersInClass,
        }
    });
})
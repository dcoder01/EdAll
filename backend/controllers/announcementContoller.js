const mongoose = require('mongoose')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorhandler');
const classModel = require('../models/classModel');
const Announcement = require('../models/announcement');


//create announcemnt
exports.createAnnouncement = catchAsyncErrors(async (req, res, next) => {

    const { content } = req.body;
    const classId = req.params.classId;
    const isValidClassId = mongoose.Types.ObjectId.isValid(classId)
    if (!isValidClassId) return next(new ErrorHandler("Invalid ClassId", 404));
    const requestedClass = await classModel.findById(classId);
    if (!requestedClass) return next(new ErrorHandler("Invalid ClassId", 404));
    const newAnnouncement = await Announcement.create({
        user: req.user._id,
        classId,
        content
    })
    requestedClass.announcements.push(newAnnouncement._id);
    await requestedClass.save();
    res.status(200).json({
        success: true,
    })


})

//delete announcemnet

exports.deleteAnnouncement = catchAsyncErrors(async (req, res, next) => {

    const announcementId = req.params.announcementId;
    const isValidAnnouncementId =
        mongoose.Types.ObjectId.isValid(announcementId);
    if (!isValidAnnouncementId) {
        return next(new ErrorHandler("Invalid announcementId", 404));

    }
    const announcementToDelete = await Announcement.findOneAndDelete({
        user: req.user._id,
        _id: announcementId,
    })

    if (!announcementToDelete) return next(new ErrorHandler("Invalid AssignmentId", 404));

     
     await classModel.findByIdAndUpdate(
        announcementToDelete.classId,
        { $pull: { announcements: announcementId } },
        { new: true }
    );
    res.status(200).json({
        success: true,
        announcementId:announcementId
    })


})

//fetch announcement
exports.fetchAnnouncements = catchAsyncErrors(async (req, res, next) => {
    const classId = req.params.classId;
    const isValidClassId = mongoose.Types.ObjectId.isValid(classId);
    if (!isValidClassId) {
        return next(new ErrorHandler("Invalid ClassId", 404))

    }
    const announcements = await classModel.findById(classId)
        .select("announcements users createdBy")
        .populate([
            {
                path: "announcements",
                populate: {
                    path: "user",
                    select: "id name email picture"
                },
            },
        ]);


    if (!announcements) {
        return next(new ErrorHandler("Invalid ClassId", 404))

    }
    //in class students or the class creater can only
    if(!announcements.users.includes(req.user._id) 
        && announcements.createdBy.equals(req.user._id))
    {
        return next(new ErrorHandler("Invalid ClassId", 404))

    }
    announcements.announcements.sort((a, b) => {
        if (
            //if return neg the a comes first
            //bigger date means newer
            new Date(a.createdAt).toISOString() >
            new Date(b.createdAt).toISOString()
        )
            return -1;
        else return 1;
    });
    res.status(200).json({
        
        announcements:announcements.announcements
        
    })






})
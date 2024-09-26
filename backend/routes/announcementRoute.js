const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth');
const { createAnnouncement, deleteAnnouncement, fetchAnnouncements } = require("../controllers/announcementContoller");

router.post('/create/:classId', isAuthenticatedUser, createAnnouncement)
router.delete('/delete/:announcementId', isAuthenticatedUser, deleteAnnouncement)
router.get('/fetch/:classId', isAuthenticatedUser, fetchAnnouncements)
module.exports=router
const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoute"));
router.use("/class", require("./classRoute"));
router.use("/quiz", require("./quizRoute"));
router.use("/assignment", require("./assignmentRoute"));
router.use("/announcement", require("./announcementRoute"));


module.exports = router;


// TODO:future segregation

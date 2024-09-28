const express= require('express')
const app=express()
const cookieParser=require('cookie-parser')
const errorMiddleware= require('./middleware/error.js')
app.use(express.json())
app.use(cookieParser())

//route imports
const assignmentRoute=require('./routes/assignmentRoute.js')
const userRoute= require('./routes/userRoute')
const classRoute=require('./routes/classRoute.js')
const announcementRoute=require('./routes/announcementRoute.js')
const quizzeRoute=require('./routes/quizRoute.js')

app.use('/api/v1', userRoute)
app.use('/api/v1', assignmentRoute)
app.use('/api/v1', classRoute)
app.use('/api/v1/announcement', announcementRoute)
app.use('/api/v1/quiz', quizzeRoute)
// app.use('/api/v1', require("./routes"))
//middleware for error

app.use(errorMiddleware)

module.exports=app
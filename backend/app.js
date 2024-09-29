const express= require('express')
const app=express()
const cookieParser=require('cookie-parser')
const errorMiddleware= require('./middleware/error.js')
app.use(express.json())
app.use(cookieParser())

//route imports

app.use('/api/v1', require("./routes/index.js"))
//middleware for error

app.use(errorMiddleware)

module.exports=app
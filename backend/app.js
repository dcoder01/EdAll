const express= require('express')
const cors = require("cors");
const cookieParser=require('cookie-parser')
const errorMiddleware= require('./middleware/error.js')
const app=express()
app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
//route imports

app.use('/api/v1', require("./routes/index.js"))
//middleware for error

app.use(errorMiddleware)

module.exports=app
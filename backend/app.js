const express = require('express')
const cors = require("cors");
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error.js')
const app = express()
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
            "Cookie",
            "Set-Cookie"
        ],
    })
);
app.options("*", cors());
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
//route imports

app.use('/api/v1', require("./routes/index.js"))
//middleware for error

app.use(errorMiddleware)

module.exports = app
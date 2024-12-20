require("dotenv").config();
const http = require('http');
const app = require('./app');
const connectDatabase = require('./config/database');
const jwt = require("jsonwebtoken");
const { error } = require("console");
const server = http.createServer(app);


app.get("/get-token", (req, res) => {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
  const options = { expiresIn: "10m", algorithm: "HS256" };
  let payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod","allow_screen_share"],
     
  };
  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
});
app.get("/", (req, res)=>{
    res.json({message:"server deplyoed properly"})
})

//connecting database
connectDatabase(process.env.MONGO_URL)
    .then((data) => {
        console.log(`mongodb connected with server: ${data.connection.host}`);

    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
 
        process.exit(1)
    });

process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exception`);
    process.exit(1)

})


//unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);


    server.close(() => {
        process.exit(1)
    })
    

})
 server.listen(process.env.PORT, () => {
    console.log("server is working", process.env.PORT);

})



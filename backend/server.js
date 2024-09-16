
const app= require('./app');
require("dotenv").config();

const connectDatabase=require('./config/database')

//handling uncaught exception

process.on("uncaughtException", err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exception`);
    process.exit(1)
    
})

// console.log(youtube);

//config
// dotenv.config({path: 'config/config.env'})

//connecting database
connectDatabase(process.env.MONGO_URL)
.then((data)=>{
    console.log(`mongodb connected with server: ${data.connection.host}`);
    
})
// .catch((err)=>{
//     console.log(err);
    
// }) 

const server=app.listen(process.env.PORT, ()=>{
    console.log("server is working", process.env.PORT);
    
})


//unhandled promise rejection

process.on('unhandledRejection',err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);


    server.close(()=>{
        process.exit(1)
    })
    
    
})

const mongoose = require('mongoose')

async function connectDatabase(url) {
    try {
        return await mongoose.connect(url);
    } catch (error) {
        console.error("connection attempt failed");
        // setTimeout(() => connectDatabase(url), 5000); 
        throw error;
    }
}
module.exports=connectDatabase
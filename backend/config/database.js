
const mongoose = require('mongoose')

async function connectDatabase(url) {
    try {
        return await mongoose.connect(url);
    } catch (error) {
        console.error("Initial connection attempt failed. Retrying...");
        setTimeout(() => connectDatabase(url), 5000); 
        // throw error;
    }
}
module.exports=connectDatabase
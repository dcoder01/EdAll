
const mongoose = require('mongoose')

async function connectDatabase(url) {
    try {
        return await mongoose.connect(url, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });
    } catch (error) {
        console.error("connection attempt failed");
       
        throw error;
    }
}
module.exports = connectDatabase
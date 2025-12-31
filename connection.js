const mongoose = require('mongoose');

async function connectDB(url){
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected successfully');
        return mongoose.connection;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

module.exports = connectDB;
const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Database connect successfully!");
    } catch (error) {
        console.log("Fail", error);
    }
}

module.exports = connectDB;
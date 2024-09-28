const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,

    },
    place: {
        type: String,
        require: true,
    },
    contact:{
        type: String,
        require: true,
    },
    created: {
        type: Date,
        require: false,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);

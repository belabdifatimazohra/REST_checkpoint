// create user schema using mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define user schema
const userShema = new Schema({
    name: {
        type: String,
        required: true,// must have name
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        unique: true,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        required: true,
    },

});

// Create collection using person Schema
const User = mongoose.model("User", userShema);
// Export the collection model 
module.exports = User;
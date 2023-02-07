const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        unique: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
})
const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
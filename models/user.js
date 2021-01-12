const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        default:undefined
    },
    resetTokenExpiration:Date
})

const Users = mongoose.model('Users',userSchema);

module.exports = Users
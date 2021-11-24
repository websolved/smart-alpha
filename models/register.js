const mongoose = require('mongoose')

const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    interest1: {
        type: String,
        default: null
    },
    interest2: {
        type: String,
        default: null
    },
    interest3: {
        type: String,
        default: null
    },
    time: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Register', registerSchema)
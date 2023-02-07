const mongoose = require('mongoose')
const { isEmail } = require('validator');

const ReceiverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        validate: [isEmail, 'invalid email']
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    bloodGroup: {
        type: String,
        required: [true, "bloodGroup is required"]
    },
    isReciever: {
        type: Boolean,
        default: true
    },
    isHospital: {
        type: Boolean,
        default: false
    }
});

const Receiver = mongoose.model("Receiver", ReceiverSchema)
module.exports = Receiver
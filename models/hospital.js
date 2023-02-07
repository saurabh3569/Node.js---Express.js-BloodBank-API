const mongoose = require('mongoose')
const { isEmail } = require('validator');


const HospitalSchema = new mongoose.Schema({
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
    isHospital: {
        type: Boolean,
        default: true
    },
    isReciever: {
        type: Boolean,
        default: false
    },

});

const Hospital = mongoose.model('Hospital', HospitalSchema)
module.exports = Hospital

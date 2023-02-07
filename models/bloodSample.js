const mongoose = require('mongoose')

const BloodSampleShema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    bloodGroup: { 
        type: String,
        required: [true, "bloodGroup is required"]
    },
    quantity: { 
        type: Number,
        required: [true, "quantity is required"]
    },
    bloodRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receiver"
    }] 
});

const BloodSample = mongoose.model("BloodSample", BloodSampleShema)
module.exports = BloodSample
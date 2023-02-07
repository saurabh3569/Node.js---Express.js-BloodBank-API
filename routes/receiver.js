const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware');
const Receiver = require('../models/receiver');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/generateToken');
const BloodSample = require('../models/bloodSample');

// Endpoint to create a receiver account
router.post("/", async (req, res) => {

    const { name, email, password, bloodGroup } = req.body

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const receiver = await Receiver.create({
            name,
            email,
            password: hashedPassword,
            bloodGroup
        });

        token = await generateToken(receiver._id)

        res.status(201).json({
            _id: receiver._id,
            name: receiver.name,
            email: receiver.email,
            bloodGroup: receiver.bloodGroup,
            token: token
        })
    } catch (error) {
        res.status(500).json(error)
    }
});


// Endpoint to signin a Receiver account
router.post("/signin", async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await Receiver.findOne({ email })

        if (!user) return res.status(404).json("User Not Exist")

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) return res.status(403).json("Wrong Credentials")

        token = await generateToken(user._id)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        })
    } catch (error) {
        res.status(500).json(error)
    }

});


// Endpoint to request a blood sample (Only accessible to receiver)
router.post("/:id/blood-samples", protect, async (req, res) => {

    if (!req.user.isReciever) return res.status(403).json("You Are Not Authorized")

    try {
        const bloodSample = await BloodSample.findById(req.params.id).select("-bloodRequest")

        if (!bloodSample) return res.status(404).json('No Blood Found')

        if (bloodSample.quantity >= 1) {
            await BloodSample.updateOne(
                { _id: req.params.id },
                {
                    $push: { bloodRequest: req.user._id },
                    $inc: { quantity: -1 }
                }
            )
        }

        const updatedBloodSample = await BloodSample.findById(req.params.id)

        res.status(200).json(updatedBloodSample)
    } catch (error) {
        res.status(500).json(error)
    }

});



module.exports = router
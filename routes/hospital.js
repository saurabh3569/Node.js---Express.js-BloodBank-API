const express = require('express')
const router = express.Router()
const generateToken = require('../config/generateToken')
const protect = require('../middleware/authMiddleware');
const Hospital = require('../models/hospital');
const bcrypt = require('bcryptjs');
const BloodSample = require('../models/bloodSample');

// Endpoint to create a hospital account
router.post("/", async (req, res) => {

    const { name, email, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    try {
        const hospital = await Hospital.create({
            name,
            email,
            password: hashedPassword
        });

        token = await generateToken(hospital._id)

        res.status(201).json({
            _id: hospital._id,
            name: hospital.name,
            email: hospital.email,
            token: token
        })
    } catch (error) {
        res.status(500).json(error)
    }

});

// Endpoint to signin a hospital account
router.post("/signin", async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await Hospital.findOne({ email })

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


// GET endpoint to get the list of all receivers who have requested a particular blood group from its blood bank (Only accessible to respective hospital)
router.get('/blood-samples/:bloodGroup', protect, async (req, res) => {

    if (!req.user.isHospital) {
        return res.status(403).json("You are not authorized")
    }

    try {
        let allBloodRequest = await BloodSample.findOne(
            {
                hospitalId: req.user._id,
                bloodGroup: req.params.bloodGroup
            }).populate("bloodRequest", "_id name email bloodGroup")

        if(allBloodRequest.bloodRequest < 1) return res.status(404).json("not blood request found")

        res.status(200).json(allBloodRequest.bloodRequest)
    }
    catch (error) {
        res.status(500).json(error)
    }


})


// GET endpoint to get all the blood info that the hospital uploaded (Only accessible to respective hospital)
router.get('/', protect, async (req, res) => {

    if (!req.user.isHospital) {
        return res.status(403).json("You are not authorized")
    } 

    try {
        let bloodInfo = await BloodSample.find({ hospitalId: req.user._id })
            .select("-bloodRequest -hospitalId")

        if (bloodInfo.length < 1) return res.status(404).json("No blood Info Found")

        res.status(200).json(bloodInfo)
    } catch (error) {
        res.status(200).json(error)
    }

})


module.exports = router


const express = require('express');
const router = express.Router()
const protect = require('../middleware/authMiddleware');
const BloodSample = require('../models/bloodSample')

// Endpoint to get all blood samples available in all hospitals (Public)
router.get("/", async (req, res) => {

    try {
        const bloodSamples = await BloodSample.find({}).select("-bloodRequest")
            .populate("hospitalId", "_id name")

        if (bloodSamples.length === 0) return res.status(404).json('Blood not Found')

        res.status(200).json({ bloodSamples })
    } catch (error) {
        res.status(500).json(error)
    }
});

// Endpoint to add a blood sample (Only accessible to hospital)
router.post("/", protect, async (req, res) => {

    const { bloodGroup, quantity } = req.body

    if (!req.user.isHospital) {
        return res.status(403).json("You are not authorized")
    }


    // checking is blood group already exist or not
    let isAlreadyExist = await BloodSample.findOne({
        bloodGroup: bloodGroup,
        hospitalId: req.user._id
    })

    // if exist then we update quantity
    if (isAlreadyExist) {
        try {
            await BloodSample.updateOne(
                { bloodGroup },
                {
                    quantity: isAlreadyExist.quantity + quantity
                })

            return res.status(200).json({
                _id: isAlreadyExist._id,
                hospitalId: isAlreadyExist.hospitalId,
                quantity: isAlreadyExist.quantity + quantity,
                bloodRequest: isAlreadyExist.bloodRequest
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        // if not exist then we create new
        try {
            const bloodSample = await BloodSample.create({
                hospitalId: req.user._id,
                bloodGroup,
                quantity
            });

            res.status(201).json(bloodSample)
        } catch (error) {
            res.status(500).json(error)
        }
    }

});



// Endpoint to update a blood sample (Only accessible to hospital)
router.put("/:id", protect, async (req, res) => {


    if (!req.user.isHospital) {
        return res.status(403).json("You are not authorized")
    }

    try {
        const updatedBloodSample = await BloodSample.findOneAndUpdate(
            { _id: req.params.id }, { $set: req.body }, { new: true })

        if (!updatedBloodSample) return res.status(404).json('Blood Sample Not Found')

        res.status(200).json(updatedBloodSample)
    } catch (error) {
        res.status(200).json(error)
    }
});



// Endpoint to delete a blood sample (Only accessible to hospital)
router.delete("/:id", protect, async (req, res) => {

    if (!req.user.isHospital) {
        return res.status(403).json("You are not authorized")
    }

    const deletBloodSample = await BloodSample.findByIdAndDelete({ _id: req.params.id })

    if (!deletBloodSample) return res.status(404).json('Blood Sample Not Found')

    res.status(200).json("deleted successfully")

});


module.exports = router


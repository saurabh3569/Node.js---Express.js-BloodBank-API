const jwt = require('jsonwebtoken')
const Hospital = require('../models/hospital')
const Receiver = require('../models/receiver')

const protect = async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
 
            //decodes token id 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Hospital.findById(decoded.id).select("-password");

            if(!req.user) req.user = await Receiver.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            return res.status(401).json("Not authorized, token failed");
        }
    }

    if (!token) {
        return res.status(401).json("Not authorized, no token");
    }


}

module.exports = protect
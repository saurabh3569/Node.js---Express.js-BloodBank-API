const mongoose = require('mongoose')

const connectDB = () => {

    try{
        mongoose.connect(process.env.MONGO_URI)
        .then(res=>console.log('db connected ....'.brightYellow))
    }catch(error){
        console.log(error)
    }

}

module.exports = connectDB
 
const express = require("express");
const dotenv = require('dotenv')
const connectDB = require('./db/connect')
const colors = require('colors');
const hospitalRoute = require('./routes/hospital')
const receiverRoute = require('./routes/receiver')
const bloodSamplesRoute = require('./routes/bloodSample')

const app = express();
dotenv.config()
app.use(express.json())


// routes
app.use('/api/hospitals', hospitalRoute)
app.use('/api/receivers', receiverRoute)
app.use('/api/blood-samples', bloodSamplesRoute)




const port = process.env.PORT || 5000

app.listen(port, async () => {
    await connectDB()
    console.log(`Server running on port : ${port}`.brightYellow);
});

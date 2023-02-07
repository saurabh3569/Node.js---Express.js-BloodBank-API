# Node.js---Express.js-BloodBank-API

Bloodbank API
This is a backend assignment to build a REST API server using ExpressJS for a bloodbank management system.

Features
User management for hospitals and receivers
Account creation and sign in for hospitals and receivers
Blood sample management for hospitals
Adding blood sample information
Updating and deleting blood sample information
Viewing list of all blood samples uploaded by the hospital
Blood request management for receivers
Requesting blood samples from hospitals
List of all receivers who have requested a particular blood group from the hospital
Public endpoints
Viewing list of all blood samples available in all hospitals
Endpoints
The API provides the following endpoints:

GET /api/blood-samples : Returns the list of all blood samples available in all hospitals (Public)

POST /api/blood-samples: Adds a new blood sample to the database (Only accessible to respective hospital)

PUT /api/blood-samples/:id: Updates the blood sample information (Only accessible to respective hospital)

DELETE /api/blood-samples/:id: Deletes the blood sample information (Only accessible to respective hospital)

GET /api/hospitals: Returns the list of  blood samples according to bloodGroup uploaded by the hospital (Only accessible to respective hospital)

POST /api/receivers/:id: Requests a blood sample (Only accessible to receiver)

GET /api/hospitals/blood-samples/:bloodGroup : Returns the list of all receivers who have requested a particular blood group from the hospital (Only accessible to respective hospital)

Tech Stack
The API is built using the following technology stack:

ExpressJS
MongoDB

How to run the API locally
Clone the repository
Install the dependencies using npm install
Start the server using npm start
The API will be available at http://localhost:5000

.env file
MONGO_URI 
PORT 
JWT_SECRET 

Contributions
Feel free to contribute to this project by submitting a pull request or opening an issue.




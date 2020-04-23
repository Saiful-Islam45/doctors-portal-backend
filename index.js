//declare middlewares
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

//use middlewares
const app = express();
app.use(cors());
app.use(bodyParser.json());
//database related information
const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

// //get request
//availableAppointments
 app.get('/availableAppointments',(req, res)=>{
 client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("availableAppointment");
        collection.find().toArray((err,documents)=>{
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            }
           else{
            res.send(documents); 
           }  
        });
        //client.close();
      });
})
//doctors dashboard actions
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.find().sort({"date":-1}).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});
//update appointment status

app.post('/updateAppointment', (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(appointment.id) }, 
            {
            $set: { "name" :appointment.name,"time" : appointment.time, "date":appointment.date, "phone" : appointment.phone },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
            }
        })
    });
})

//show patients list
app.get('/patients', (req, res) => {
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("patients");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});

//count total patients
app.get('/totalPatients', (req, res) => {
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("patients");
        collection.countDocuments((err,countData)=>{
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                const total = [countData]
                res.send(total);
            }
            
            });
    });
});
// //post request
//update patients status
app.post('/updateStatus', (req, res) => {
    const appointment = req.body;
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(appointment.id) }, 
            {
            $set: {  "status" : appointment.status },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        })
    });
})
//update visited
app.post('/updateVisited', (req, res) => {
    const visited = req.body;
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(visited.id) }, 
            {
            $set: {  "visited" : visited.visitStatus },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        })
    });
})
//update Prescription status
app.post('/updatePrescription', (req, res) => {
    const appointment = req.body;
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(appointment.id) }, 
            {
            $set: {  "prescription" : appointment.prescription },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        })
    });
})
//confirm Appointment
app.post('/confirmAppointment', (req, res) => {
    const appointmentDetail = req.body
    appointmentDetail.postTime = new Date()
    appointmentDetail.status = "pending";
    appointmentDetail.prescription = null;
    appointmentDetail.visited = "false";
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.insertOne(appointmentDetail, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
               // console.log("appointment");
                
                res.send(result.ops[0]);
            }
        })
    });
})
//add Available Appointment
app.post('/addAvailableAppointment',(req,res)=>{
    //data save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    
    client.connect(error => {
        const collection = client.db("doctorsPortal").collection("availableAppointment");
        collection.insert(product ,(err,result)=>{
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            }
           else{
            console.log("Database Connected");
            res.send(result.ops[0]); 
           }  
        });
        //client.close();
      });
});

//Add new patient
app.post('/addPatient', (req, res) => {
    const patientDetails = req.body
    patientDetails.postTime = new Date()
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("patients");
        collection.insertOne(patientDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops[0]);
            }
        })
    });
})
const port=process.env.PORT ||5200
app.listen(port, ()=>console.log("Listening at Port 5200"));
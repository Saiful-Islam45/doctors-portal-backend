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
// //post request
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
//addAvailableAppointment
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
const port=process.env.PORT ||5200
app.listen(port, ()=>console.log("Listening at Port 5200"));
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
// //single product details by id
// app.get('/products/:id',(req, res)=>{
//     client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
   
//     const id = Number(req.params.id);
    
//     client.connect(err => {
//         const collection = client.db("hotOnion").collection("allProducts");
//         collection.find({id:id}).toArray((err,documents)=>{
//             if (err) {
//                 console.log(err);
//                 res.status(500).send({message:err});
//             }
//             else{
//             res.send(documents[0]); 
//             }  
//         });
//         //client.close();
//         });
// })
//    //oder placed
//    app.post('/placeOrder',(req,res)=>{
//     const orderInfo = req.body;
//     console.log(" Before orderInfo",orderInfo);

//     orderInfo.orderTime= new Date();
//     console.log(" After orderInfo",orderInfo);
//     client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    
//     client.connect(error => {
//         const collection = client.db("hotOnion").collection("orders");
//         collection.insert(orderInfo ,(err,result)=>{
//             if (err) {
//                 console.log(err);
//                 res.status(500).send({message:err});
//             }
//            else{
//             res.send(result.ops[0]); 
//            }  
//         });
//         //client.close();
//       });
// });

app.get('/allappointments', (req, res) => {
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
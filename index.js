const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient
// const url = "mongodb://localhost:27017"
const url = "mongodb+srv://varghese123:varghese123@cluster0-yqune.mongodb.net/<dbname>?retryWrites=true&w=majority"
const cors = require("cors")

app.use(cors({
    origin:"http://127.0.0.1:5500"
}))

//before implementiong it let discuss the operations that we need to do for doing DB operations
//Open the connection with DB server
//select DB
//select the collection
//perform DB operations (CRUD)
//close the connection - ensure to close the connection


app.use(express.json());

// yesteday what we did, we created an empy array and pushed data into it. now we are going to replace it with DB

// let students = []

// let teachers = []

app.get("/students", async (req,res)=>{
    let client = await mongoClient.connect(url);
    let db = client.db("b19wd");
    let students = await db.collection("students").find().toArray();
    client.close();
    res.json(students)
})

app.get("/teachers",(req,res)=>{
    res.json(teachers)
})


app.post("/student", async (req,res)=>{
    try {
        
        let client = await mongoClient.connect(url)//why we are opening a connection inside the route?
        //if we keep it open everytime will lead to security issues, so we need open the connection only in the route
        let db = client.db("b19wd");
        //first write this without await and then with explanation add await into it.
        await db.collection("students").insertOne({name:req.body.name})
        client.close();
        res.json(
                {
                    message:"Success"
                }
                )
    } catch (error) {
        console.log(error)
    }




    // let studentData = {
    //     id:students.length + 1,
    //     name:req.body.name
    // }
    // students.push(studentData)
    // res.json(
    //     {
    //         message:"Success",
    //         id:studentData.id
    //     }
    //     )
})


app.get("/student/:id",async(req,res)=>{

    try {
        let client = await mongoClient.connect(url);
    let db = client.db("b19wd");
    let id = mongodb.ObjectID(req.params.id)
    let student = await db.collection("students").findOne({_id:id})
    client.close();
    if(student) res.json(student);
    else res.json({message:"No record with this reference"})
    } catch (error) {
        res.json({message:"Something went wrong"})
    }
    // if(students[req.params.id - 1]){
    //     res.json(students[req.params.id - 1])
    // }else{
    //     res.json({
    //         message:"no record available"
    //     })
    // }
})


app.put("/student/:id", async (req,res)=>{

    try {
        let client = await mongoClient.connect(url);
    let db = client.db("b19wd");
    let id = mongodb.ObjectID(req.params.id)
    let student = await db.collection("students").findOneAndUpdate({_id:id},{$set:{name:req.body.name}})
    client.close();
    if(student) res.json(student);
    else res.json({message:"No record with this reference"})
    } catch (error) {
        res.json({message:"Something went wrong"})
    }
    // if(students[req.params.id - 1]){
    //     students[req.params.id - 1].name = req.body.name;
    // res.json({
    //     message:"Record updated"
    // })
    // }else{
    //     res.json({
    //         message:"no record available"
    //     })
    // }
})

app.delete("/student/:id", async (req,res)=>{
    try {
        let client = await mongoClient.connect(url);
    let db = client.db("b19wd");
    let id = mongodb.ObjectID(req.params.id)
    let student = await db.collection("students").findOneAndDelete({_id:id})
    client.close();
    if(student) res.json({message:"Record deleted"});
    else res.json({message:"No record with this reference"})
    } catch (error) {
        res.json({message:"Something went wrong"})
    }
    // let studentDetail = students.find((student)=> student.id == req.params.id);
    // let studentIndex = students.indexOf(studentDetail);
    // students.splice(studentIndex,1);
    // res.json({
    //     message:"Record deleted"
    // })
})



let port = 3000
app.listen(process.env.PORT || port,()=>{
    console.log(`app listning at ${port}`)
})

const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();

const mongoDbConnector = ()=>{
    mongodbClient.connect(process.env.MONGODB_URL).then(result=>{
        console.log("connected to mongodb");
        console.log(result)
    }).catch(err=>console.log(err));
}

module.exports = mongoDbConnector;

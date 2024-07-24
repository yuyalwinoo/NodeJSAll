const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
let db;

const mongoDbConnector = ()=>{
    mongodbClient.connect(process.env.MONGODB_URL).then(result=>{
        console.log("connected to mongodb");
        db = result.db();
        console.log(result)
    }).catch(err=>console.log(err));
}

const getDB = () => {
    if(db)
    {
        return db;
    }
    throw "No database";
}

module.exports = {mongoDbConnector,getDB};

const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const postsRoutes = require("./routes/posts")
const {adminRoutes} = require("./routes/admin")
const indexRoutes = require("./routes/index")

const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const app = express();
//console.log(postsRoutes);
app.set("view engine","ejs");
app.set("views","views");

// to connect public folder
app.use(express.static(path.join(__dirname,"public"))); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use((req,res,next)=>{
    console.log("middleware 2")
    next()
})


app.use(indexRoutes);
app.use("/posts",postsRoutes);
app.use("/admin",adminRoutes);

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(8080);
}).catch(err=>console.log(err));

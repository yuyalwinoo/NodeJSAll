const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const sequelize = require('./utils/database')

const postsRoutes = require("./routes/posts")
const {adminRoutes} = require("./routes/admin")
const indexRoutes = require("./routes/index")
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

sequelize.sync()
.then(result=>{
    console.log(result)
    app.listen(8080);
})
.catch(err=>console.log(err))

//app.listen(8080);
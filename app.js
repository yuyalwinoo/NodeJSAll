const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const postsRoutes = require("./routes/posts")
const {adminRoutes} = require("./routes/admin")
const indexRoutes = require("./routes/index")

const User = require('./models/user')
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


app.use((req, res, next) => {
    User.findById("66af41bddd7a8808838fd67c").then((user) => {
        req.user = user;
        next();
    });
});

app.use(indexRoutes);
app.use("/posts",postsRoutes);
app.use("/admin",adminRoutes);

mongoose.connect(process.env.MONGODB_URL)
.then((_) => {
    console.log("connected to mongodb!!!");
    return User.findOne().then((user) => {
      if (!user) {
        User.create({
          username: "Yuya",
          email: "yuya@gmail.com",
          password: "1234",
        });
      }
      return user;
    });
  })
.then(()=>{
    app.listen(8080);
}).catch(err=>console.log(err));

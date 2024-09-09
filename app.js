const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf  = require('csurf')

const postsRoutes = require("./routes/posts")
const {adminRoutes} = require("./routes/admin")
const indexRoutes = require("./routes/index")
const authRoutes = require("./routes/auth")

const User = require('./models/user')

const {isLogin} = require("./middleware/isLogin")

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'mySessions'
});

app.set("view engine","ejs");
app.set("views","views");

// to connect public folder
app.use(express.static(path.join(__dirname,"public"))); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(session(
  {
    secret : process.env.SESSION_KEY, 
    resave : false, 
    saveUninitialized : false,
    store
  }));

  const csrfProtection = csrf();
  app.use(csrfProtection);

  app.use((req, res, next) => {
  // console.log(req.session);
  if(req.session.isLogin === undefined)
  {
    return next();
  }

  User.findById(req.session.userInfo._id).select("_id email").then((user) => {
      req.user = user;
      next();
  });
});

//csrftoke to every page render
app.use((req,res,next)=>{
  res.locals.isLogin = req.session.isLogin ? true : false,
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use(indexRoutes);
app.use("/posts",postsRoutes);
app.use("/admin",isLogin,adminRoutes);
app.use(authRoutes);

mongoose.connect(process.env.MONGODB_URL)
.then((_) => {
    console.log("connected to mongodb!!!");
  })
.then(()=>{
    app.listen(8080);
}).catch(err=>console.log(err));

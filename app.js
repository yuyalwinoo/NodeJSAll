const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const sequelize = require('./utils/database')

const User = require('./models/user')
const Post = require('./models/post')

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
    User.findByPk(1).then(user=>{
        req.user = user;
        next()
    })
    .catch(err=>console.log(err))
})

app.use(indexRoutes);
app.use("/posts",postsRoutes);
app.use("/admin",adminRoutes);

Post.belongsTo(User,{ constraints : true, onDelete : "CASCADE"});
User.hasMany(Post);

sequelize.sync()  //{force : true}
    .then(result=>{
        return User.findByPk(1)
    })
    .then(user=>{
        if(!user){
            return User.create({name : 'Yuya Lwin Oo',email : "yuya123@gmail.com"})
        }
        return user;
    })
    .then(user=>{
        console.log(user);
        app.listen(8080);
    })
    .catch(err=>console.log(err))

//app.listen(8080);
const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/",(req,res,next)=>{
    // res.sendFile(path.join(__dirname,"..","views","homePage.html"))
    res.render("home",{title:'HelloWorld'});
})

module.exports = router;
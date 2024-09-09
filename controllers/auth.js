const bcrypt = require("bcrypt");

const User = require("../models/user");

// Login
exports.getLoginPage = (req,res)=> {
    res.render("auth/login",{title:'Login'})
}

exports.postLoginData = (req,res) => {
    //res.setHeader("Set-Cookie","isLogin=true");
    // 
    //res.redirect("/posts");

    const {email, password} = req.body;
    User.findOne({email})
    .then(
        user=>{
            if(!user)
            {
                return res.redirect("/login")
            } 
            bcrypt.compare(password,user.password).then(
                isMatch => {
                    if(isMatch)
                    {
                        req.session.isLogin = true;
                        req.session.userInfo = user;
                        return req.session.save(err=>{
                            res.redirect("/posts");
                            console.log(err);
                        })
                    }
                    res.redirect("/login")
                }
            )
        }
    )
    .catch(
        err=>console.log(err)
    )
    }

// Register
exports.getRegisterPage = (req,res)=> {
    res.render("auth/register",{title:'Register'})
}
exports.registerAccount = (req,res)=> {
   const {email, password} = req.body;
   User.findOne({email}).then(
    user=>{
        if(user)
        {
            return res.redirect("/register")
        }
        return bcrypt.hash(password,10)
        .then( hashedPassword => {
                return User.create({
                    email,
                    password : hashedPassword
                })
            }
        )
        .then(()=>{
            res.redirect("/login");
        })
        
    }
    ).catch(
        err=>console.log(err)
    )
}

// Logout
exports.logout = (req,res)=> {
    
    req.session.destroy(()=>{
        res.redirect("/posts")
    });
}

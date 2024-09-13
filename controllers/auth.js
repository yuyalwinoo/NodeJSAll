const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require("../models/user");

let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.MAIL_SENDER,
        pass : process.env.MAIL_PASSWORD,
    }
})


// Login
exports.getLoginPage = (req,res)=> {
    res.render("auth/login",{title:'Login',errorMsg:req.flash("error"),oldFrameData : {email:'',password:''}})
}

exports.postLoginData = (req,res) => {
    //res.setHeader("Set-Cookie","isLogin=true");
    // 
    //res.redirect("/posts");

    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(422).
        render("auth/login",{title:'Login',errorMsg:errors.array()[0].msg,oldFrameData : {email,password}})
    }
    User.findOne({email})
    .then(
        user=>{
            if(!user)
            {
                return res.status(422)
                .render("auth/login",{title:'Login',errorMsg:"Please enter valid email and password.",oldFrameData : {email,password}})
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
                    res.status(422).render("auth/login",{title:'Login',errorMsg:"Please enter valid email and password.",oldFrameData : {email,password}})
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
    res.render("auth/register",{title:'Register',errorMsg:req.flash("error"),oldFrameData : {email:'',password:''}})
}
exports.registerAccount = (req,res)=> {
   const {email, password} = req.body;
   const errors = validationResult(req);
   if(!errors.isEmpty())
    {
        return res.status(422)
        .render("auth/register",
            {
                title:'Register',
                errorMsg:errors.array()[0].msg,
                oldFrameData : {email,password}
            })
    }
    bcrypt.hash(password,10)
    .then( hashedPassword => {
            return User.create({
                email,
                password : hashedPassword
            })
        }
    )
    .then(()=>{
        res.redirect("/login");
        transporter.sendMail({
            from : process.env.MAIL_SENDER,
            to : email,
            subject: "Account Created Successfully",
            html: "<p>Thank you for creating your account.</p>",
        },(err=>console.log(err)))
    })
        
}

// Logout
exports.logout = (req,res)=> {
    
    req.session.destroy(()=>{
        res.redirect("/posts")
    });
}

// reset password
exports.getResetPage = (req,res)=> {
    res.render("auth/reset",{title:'Reset Password',errorMsg:req.flash("error"),oldFrameData : {email:''}})
}
exports.getFeedbackPage = (req,res)=> {
    res.render("auth/feedback",{title:'Feedback'})
}
exports.getNewPasswordPage = (req,res)=> {
    const {token} = req.params;
    User.findOne(
        {
            resultToken:token,
            tokenExpiration:
                {
                    $gt:Date.now()
                }
        }).then(user=>{
                if(user)
                {
                    return res.render("auth/newPassword",{title:'New Password',errorMsg:req.flash("error"),resultToken:token,userId:user._id.toString(),oldFrameData : {password:'',confirmPassword:''}})
                }else {
                    return res.redirect('/login')
                }
            }
        )
        .catch(err=>console.log(err))
}

exports.resetLinkSend = (req,res)=> {
    const {email} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(422)
        .render("auth/reset",
            {
                title:'Reset Password',
                errorMsg:errors.array()[0].msg,
                oldFrameData : {email}
            })
    }
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {
            console.log(err);
            return res.redirect("/reset-password")
        }
        const token = buffer.toString("hex");
        User.findOne({
            email
        }).then(user=>{
            if(!user)
            {
                return res.status(422)
                .render("auth/reset",
                    {
                        title:'Reset Password',
                        errorMsg:"No account found with this email",
                        oldFrameData : {email}
                    })
            }
            user.resultToken = token;
            user.tokenExpiration = Date.now() + 1800000; //30min
            return user.save(); 
        }).then(result=>{
            res.redirect("/feedback")
            transporter.sendMail({
                from : process.env.MAIL_SENDER,
                to : email,
                subject: "Reset Password",
                html: `<h1>Change reset password now.</h1><p><a href="http://localhost:8080/reset-password/${token}" target="_blank">Click here</a></p>`,
            },(err=>console.log(err)))
        }).catch(err=>console.log(err))
    })
}

exports.changeNewPassword = (req,res)=>{
    const {password,confirmPassword,resultToken,userId} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(422)
        .render("auth/newPassword",
            {
                title:'Reset Password',
                errorMsg:errors.array()[0].msg,
                resultToken,
                userId,
                oldFrameData : {password,confirmPassword}
            })
    }

    let resetUser;
    User.findOne({
        resultToken,
        tokenExpiration : {$gt : Date.now()},
        _id:userId
    }).then(user=>{

            resetUser = user;
            return bcrypt.hash(password,10)


    }).then(hashedPassword=>{
        
        resetUser.password = hashedPassword;
        resetUser.resultToken = undefined;
        resetUser.tokenExpiration = undefined;
        
        return resetUser.save();
    }).then(()=>{
        return res.redirect('/login')
    })
    .catch(err=>console.log(err))
}

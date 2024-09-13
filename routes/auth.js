const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");

router.get("/login",authController.getLoginPage);
router.post("/login",
        body("email")
        .isEmail().
        withMessage("Please enter Invalid email."),
        body("password").isLength({min : 4,max : 8})
        .trim()
        .withMessage("Password must have between 4 and 8 characters."),
    authController.postLoginData);
router.post("/logout",authController.logout);

router.get("/register",authController.getRegisterPage);
router.post("/register", 
            body("email")
            .isEmail().
            withMessage("Please enter Invalid email.")
            .custom((value)=>{
                return User.findOne({email : value})
                .then((user)=>{
                    if(user)
                    {
                        return Promise.reject("Email already exists.Try another one.")
                    }
                })
            }),
            body("password").isLength({min : 4,max : 8}).trim().withMessage("Password must have between 4 and 8 characters."),
            authController.registerAccount);

router.get("/reset-password",authController.getResetPage);
router.post("/reset",authController.resetLinkSend);
router.get("/feedback",authController.getFeedbackPage);
router.get("/reset-password/:token",authController.getNewPasswordPage);
router.post("/change-new-password",
        body("password").isLength({min : 4,max : 8})
        .trim()
        .withMessage("Password must have between 4 and 8 characters."),
        body("confirmPassword")
        .trim()
        .custom((value,{req})=>{
            if(value !== req.body.password)
            {
                throw new Error("Password must match.")
            }
            return true;
        })
    ,authController.changeNewPassword);

module.exports = router;
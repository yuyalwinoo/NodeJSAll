const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login",authController.getLoginPage);
router.post("/login",authController.postLoginData);
router.post("/logout",authController.logout);

router.get("/register",authController.getRegisterPage);
router.post("/register",authController.registerAccount);

module.exports = router;
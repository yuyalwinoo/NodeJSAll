const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login",authController.getLoginPage);
router.post("/login",authController.postLoginData);
router.post("/logout",authController.logout);

router.get("/register",authController.getRegisterPage);
router.post("/register",authController.registerAccount);

router.get("/reset-password",authController.getResetPage);
router.post("/reset",authController.resetLinkSend);
router.get("/feedback",authController.getFeedbackPage);
router.get("/reset-password/:token",authController.getNewPasswordPage);
router.post("/change-new-password",authController.changeNewPassword);

module.exports = router;
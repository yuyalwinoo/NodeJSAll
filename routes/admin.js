const express = require("express");
const path = require("path");
const postsController = require("../controllers/posts")
const router = express.Router();

router.get("/create-post",postsController.renderCreatePage)

router.post("/",postsController.createPost)

module.exports = {adminRoutes:router};
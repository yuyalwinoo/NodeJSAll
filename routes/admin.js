const express = require("express");
const path = require("path");
const postsController = require("../controllers/posts")
const router = express.Router();

router.get("/create-post",postsController.renderCreatePage)

router.post("/",postsController.createPost)

router.post("/post/:postID",postsController.deletePost)

router.get("/post-edit/:postID",postsController.getOldPost)

router.post("/post-edit",postsController.updatePost)

module.exports = {adminRoutes:router};
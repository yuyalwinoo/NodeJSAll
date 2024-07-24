const express = require("express");
const path = require("path");
const postsController = require("../controllers/posts")
const router = express.Router();

router.get("/create-post",postsController.renderCreatePage)

router.post("/",postsController.createPost)

router.get("/edit/:postID",postsController.getEditPost)

router.post("/edit-post",postsController.updatePost)

router.post("/delete/:postID",postsController.deletePost)

module.exports = {adminRoutes:router};
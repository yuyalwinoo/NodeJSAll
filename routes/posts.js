const express = require("express");
const path = require("path");
const postsController = require("../controllers/posts")

const router = express.Router();

router.get("/",postsController.getAllPosts)
router.get("/:postID",postsController.getPost)

module.exports = router; 
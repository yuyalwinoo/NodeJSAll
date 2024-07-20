const express = require("express");
const path = require("path");
const postsController = require("../controllers/posts")

const router = express.Router();

router.get("/",postsController.renderPostsPage)
router.get("/:postID",postsController.renderDetailPage)

module.exports = router; 
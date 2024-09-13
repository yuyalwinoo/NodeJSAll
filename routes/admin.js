const express = require("express");
const postsController = require("../controllers/post")
const router = express.Router();
const { body } = require("express-validator");



router.get("/create-post",postsController.renderCreatePage)

router.post("/",[
    body("title")
    .isLength({min:10})
    .withMessage("Title must have at least 10 characters."),

    body("imgURL")
    .isURL()
    .withMessage("ImageURL must be valid url."),

    body("description")
    .isLength({min:30})
    .withMessage("Description must have at least 30 characters."),
    
],postsController.createPost)

router.get("/edit/:postID",postsController.getEditPost)

router.post("/edit-post",[
    body("title")
    .isLength({min:10})
    .withMessage("Title must have at least 10 characters."),

    body("imgURL")
    .isURL()
    .withMessage("ImageURL must be valid url."),

    body("description")
    .isLength({min:30})
    .withMessage("Description must have at least 30 characters."),
    
],postsController.updatePost)

router.post("/delete/:postID",postsController.deletePost)

module.exports = {adminRoutes:router};
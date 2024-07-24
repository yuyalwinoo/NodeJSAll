const posts = []; 
const Post = require("../models/post")
exports.createPost = (req,res,next)=>{
    const {title, description, imgURL} = req.body;
    const post = new Post(title,description,imgURL);
    post.create()
   res.redirect("/posts")
}

exports.renderCreatePage = (req,res,next)=>{
    // res.send("<h1>I am Posts </h1>")
    //res.sendFile(path.join(__dirname,"..","views","addPost.html"))
    res.render("addPost",{title:"AddPost"})
}

exports.renderPostsPage = (req,res,next)=>{
    Post.getPosts().then(posts=>{
        res.render("posts",{title:'Posts',posts})
    }).catch(err=>err)
}

exports.renderDetailPage = (req,res,next)=>{
//   const post = posts.filter(post=>+post.id === +req.params.postID);
    const postID = req.params.postID;
    Post.getPost(postID).then(post=>{
        res.render("detail",{title : post.title, post})
    }).catch(err=>err)
}
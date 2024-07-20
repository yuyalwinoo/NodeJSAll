const PostModel = require("../models/posts");
// const posts = []; 

exports.createPost = (req,res,next)=>{
    const {title, description, imgURL} = req.body;
    // posts.push({
    //     id: Math.random(),
    //     title,
    //     description,
    //     imgURL
    // })
    const post = new PostModel(title,description,imgURL);
    post.setPost()
    .then(()=>{
        res.redirect("/posts")
    }).catch(err=>console.log(err))
  
}

exports.renderCreatePage = (req,res,next)=>{
    // res.send("<h1>I am Posts </h1>")
    //res.sendFile(path.join(__dirname,"..","views","addPost.html"))
    res.render("addPost",{title:"AddPost"})
}

exports.getAllPosts = (req,res,next)=>{
    PostModel.getAllPosts()
    .then(([row])=>{
        console.log(row)
        res.render("posts",{title:'Posts',posts:row})
    })
    .catch(err=>console.log(err))
   
}

exports.getPost = (req,res,next)=>{
  //const post = posts.filter(post=>+post.id === +req.params.postID);
  PostModel.getSinglePost(+req.params.postID)
    .then(([row])=>{
        console.log(row)
        res.render("detail",{title:'Detail',post:row[0]})
    })
    .catch(err=>console.log(err))
  
}
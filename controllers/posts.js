const posts = []; 

exports.createPost = (req,res,next)=>{
    const {title, description, imgURL} = req.body;
    posts.push({
        id: Math.random(),
        title,
        description,
        imgURL
    })
   res.redirect("/posts")
}

exports.renderCreatePage = (req,res,next)=>{
    // res.send("<h1>I am Posts </h1>")
    //res.sendFile(path.join(__dirname,"..","views","addPost.html"))
    res.render("addPost",{title:"AddPost"})
}

exports.renderPostsPage = (req,res,next)=>{
    // res.send("<h1>I am Posts </h1>")
    //res.sendFile(path.join(__dirname,"..","views","PostsPage.html"))
    res.render("posts",{title:'Posts',posts})
}

exports.renderDetailPage = (req,res,next)=>{
  const post = posts.filter(post=>+post.id === +req.params.postID);
  res.render("detail",{title:'Detail',post})
}
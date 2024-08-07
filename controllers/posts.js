const Post = require("../models/post");
// const posts = []; 

// --create post using mysql--
// exports.createPost = (req,res,next)=>{
//     const {title, description, imgURL} = req.body;
//     // posts.push({
//     //     id: Math.random(),
//     //     title,
//     //     description,
//     //     imgURL
//     // })
//     const post = new Post(title,description,imgURL);
//     post.setPost()
//     .then(()=>{
//         res.redirect("/posts")
//     }).catch(err=>console.log(err))
  
// }


// --create post using sequlize--
exports.createPost = (req,res,next)=>{
    const {title, description, imgURL} = req.body;
    req.user.createPost({
        title,
        description,
        imgUrl:imgURL
    }).then((result)=>{
        console.log("New Post Created.")
        res.redirect("/posts")
    })
    .catch(err=>console.log(err))
  
}

exports.renderCreatePage = (req,res,next)=>{
    // res.send("<h1>I am Posts </h1>")
    //res.sendFile(path.join(__dirname,"..","views","addPost.html"))
    res.render("addPost",{title:"AddPost"})
}


// --get all post using mysql--
// exports.getAllPosts = (req,res,next)=>{
//     Post.getAllPosts()
//     .then(([row])=>{
//         console.log(row)
//         res.render("posts",{title:'Posts',posts:row})
//     })
//     .catch(err=>console.log(err))
   
// }

// --get all post using sequlize--
exports.getAllPosts = (req,res,next)=>{
    Post.findAll({order : [["updatedAt","DESC"]]})
    .then((posts)=>{
        res.render("posts",{title:'Posts',posts})
    })
    .catch(err=>console.log(err))
   
}

// --get post using mysql--
// exports.getPost = (req,res,next)=>{
//   //const post = posts.filter(post=>+post.id === +req.params.postID);
//   Post.getSinglePost(+req.params.postID)
//     .then(([row])=>{
//         console.log(row)
//         res.render("detail",{title:'Detail',post:row[0]})
//     })
//     .catch(err=>console.log(err))
  
// }

// --get post using sequlize--
exports.getPost = (req,res,next)=>{
    //const post = posts.filter(post=>+post.id === +req.params.postID);
    Post.findOne({where : {id : +req.params.postID}})
      .then(post=>{
          res.render("detail",{title:`${post.title}`,post})
      })
      .catch(err=>console.log(err))
    
  }

exports.deletePost = (req,res) =>{
    const postID = +req.params.postID;
    Post.findByPk(postID)
    .then((post)=>{
        if(!post){
            res.redirect("/posts")
        }
        return post.destroy();
    })
    .then(()=>{
        console.log("Delete Successful!");
        res.redirect("/posts")
    })
    .catch(err=>console.log(err))
}

exports.getOldPost = (req,res)=>{
    const postID = +req.params.postID;
    Post.findByPk(postID)
    .then((post)=>{
        res.render("editPost",{title:`${post.title}`,post})
    })
    .catch(err=>console.log(err))
}

exports.updatePost = (req,res)=>{
    const {title,imgURL,description,postID} = req.body;
    Post.findByPk(postID)
    .then((post)=>{
        post.title = title,
        post.description = description,
        post.imgUrl = imgURL
        return post.save()
    })
    .then(result=>{
        console.log(`Post ID ${postID} successfully updated.`)
        res.redirect("/posts");
    })
    .catch(err=>console.log(err))
}
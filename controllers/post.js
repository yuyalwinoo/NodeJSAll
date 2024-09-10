const Post = require("../models/post")

exports.createPost = (req,res,next)=>{
    const {title, description, imgURL} = req.body;
    Post.create({
        title, 
        description, 
        imgUrl: imgURL,
        userId : req.user
    }).then(()=>{
        console.log("Post created");
        res.redirect("/posts")
    }).catch(err=>console.log(err))
}

exports.renderCreatePage = (req,res,next)=>{
    res.render("addPost",{title:"AddPost"})
}

exports.renderPostsPage = (req,res,next)=>{
    //const cookie = req.get("Cookie").split("=")[1].trim() === "true";
     //console.log("isLogin",req.session.isLogin);
    Post.find()
    .select("title description")
    .populate("userId","email")
    .sort({title:1})
    .then(posts=>{
        res.render(
            "posts",
                {   
                    title:'Posts',
                    posts, 
                    currentUserEmail : req.session.userInfo ? req.session.userInfo.email : ''
                }
            )
    })
    .catch(err=>err)
}

exports.renderDetailPage = (req,res,next)=>{
    const postID = req.params.postID;
    Post.findById(postID).then(post=>{
        res.render("detail",{title : post.title, post,currentUserId : req.session.userInfo ? req.session.userInfo._id : ''})
    }).catch(err=>err)
}

exports.getEditPost = (req,res,next)=>{
    const postID = req.params.postID;
    Post.findById(postID).then(post=>{
        if(!post)
        {
            res.redirect("/posts")
        }
        res.render("editPost",{title : post.title, post})
    }).catch(err=>err)
    }

exports.updatePost = (req,res,next) =>{
    const {title, description, imgURL,postID} = req.body;

    Post.findById(postID).then(post=>{
        if(post.userId.toString() !== req.user._id.toString())
        {
            return res.redirect("/posts")
        }
        if(post)
        {
           post.title = title;
           post.description = description;
           post.imgUrl = imgURL;
           return post.save().then(()=>{
                console.log("Post updated");
                res.redirect("/posts")
            })
        }
        
    }).catch(err=>err)

}

exports.deletePost = (req,res,next) => {
    const postID = req.params.postID;
    Post.deleteOne({_id : postID, userId : req.user._id}).then(result=>{
        res.redirect("/posts")
    }).catch(err=>err)
    
}
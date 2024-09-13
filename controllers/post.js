const Post = require("../models/post")
const { validationResult } = require('express-validator');
const { formatISO9075 } = require("date-fns");

exports.createPost = (req,res,next)=>{
    const {title, description, imgURL} = req.body;

    const errors = validationResult(req);
    
    if(!errors.isEmpty())
    {
        return res.status(422).
        render("addPost",{title:'AddPost',errorMsg:errors.array()[0].msg,oldFrameData : {title,imgURL,description}})
    }

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
    res.render("addPost",{title:"AddPost",errorMsg:'',oldFrameData : {title:'',imgURL:'',description:''}})
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
    Post.findById(postID)
    .populate("userId","email")
    .then(post=>{
        res.render("detail",
            {
                title : post.title, 
                post,
                createDate: post.createdAt ? formatISO9075(post.createdAt,{ representation: 'date' }) : '',
                currentUserId : req.session.userInfo ? req.session.userInfo._id : ''
            }
        )
    }).catch(err=>err)
}

exports.getEditPost = (req,res,next)=>{
    const postID = req.params.postID;
    Post.findById(postID).then(post=>{
        if(!post)
        {
            res.redirect("/posts")
        }
        res.render("editPost",{title : post.title, post,errorMsg:'',oldFrameData : {title:'',imgURL:'',description:'',postID},validationFail:false})
    }).catch(err=>err)
    }

exports.updatePost = (req,res,next) =>{
    const {title, description, imgURL,postID} = req.body;

    const errors = validationResult(req);
    
    if(!errors.isEmpty())
    {
        return res.status(422).
        render("editPost",{title,errorMsg:errors.array()[0].msg,oldFrameData : {title,imgURL,description,postID},validationFail:true})
    }


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
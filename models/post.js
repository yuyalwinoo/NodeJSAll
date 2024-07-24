const {getDB} = require("../utils/database")
const {ObjectId} = require("mongodb")
class Post {
    constructor(title,description,imgUrl){
        this.title = title;
        this.description = description;
        this.imgUrl = imgUrl;
    }

    create(){
        const db = getDB();
        return db.collection("posts")
        .insertOne(this)
        .then(result=>console.log(result))
        .catch(err=>console.log(err))
    }

    static getPosts(){
        const db = getDB();
        return db.collection("posts").find().toArray()
        .then(posts=>{
            console.log(posts);
            return posts;
        })
        .catch(err=>console.log(err))
    }

    static getPost(postID){
        const db = getDB();
        return db.collection("posts").find({_id:new ObjectId(postID)})
        .next()
        .then(post=>{
            console.log(post);
            return post;
        })
        .catch(err=>console.log(err))
    }
}
module.exports = Post;
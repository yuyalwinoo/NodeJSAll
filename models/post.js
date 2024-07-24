const {getDB} = require("../utils/database")
const {ObjectId} = require("mongodb")
class Post {
    constructor(title,description,imgUrl,id){
        this.title = title;
        this.description = description;
        this.imgUrl = imgUrl;
        this._id = id ? new ObjectId(id) : null;
    }

    create(){
        const db = getDB();
        let dbTmp;
        if(this._id){
            //update
            dbTmp = db.collection("posts")
            .updateOne({_id: this._id}, {$set : this})
        } else {
            dbTmp = db.collection("posts")
            .insertOne(this)
        }
        return dbTmp
        .then(result=>console.log(result))
        .catch(err=>console.log(err))
    }

    static getPosts(){
        const db = getDB();
        return db.collection("posts").find().sort({title:1}).toArray()
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

    static deletePost(postID){
        const db = getDB();
        return db.collection("posts").deleteOne({_id:new ObjectId(postID)})
        .then(result=>{
            console.log("post deleted");
        })
        .catch(err=>console.log(err))
    }
}
module.exports = Post;
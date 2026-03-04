const mongoose=require("mongoose");

const postSchema = new mongoose.Schema({
content:{type:String, trim:true, required:true, maxlength:5000},
authorId:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
authorName:{type:String, unique:true, required:true},
createdAt:{type:Date, default:Date.now}
})

const Post = mongoose.model("Post", postSchema);

// Create CRUD operations for User model

// Create Post
async function insertPost(content, authorId, authorName) {
    const newPost = await Post.create({
        content: content,
        authorId: authorId,
        authorName: authorName
    });
    return newPost;
}


// Read all Posts by authorId
async function getPostsByAuthor(authorId) {
    return await Post.find({ authorId: authorId }).sort({ createdAt: -1 }); // returns an array of posts sorted by creation date (newest first)
}
 

// Update Post
async function updatePost(userId, createdAt, content) {
    const post = await Post.updateOne({"authorId": userId, "createdAt": createdAt}, {$set:{content: content}});
    return post; // A result object describing the update operation info.
}

// Delete Posts by User Id
async function deletePost(userId) {
    await Post.deleteMany({"authorId": userId});
}


// export the functions (we need them in route files)
module.exports = {
    insertPost,
    getPostsByAuthor,
    updatePost,
    deletePost
}
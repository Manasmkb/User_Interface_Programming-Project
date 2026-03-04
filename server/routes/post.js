// HTTP method: GET, POST, PUT, DELETE

const express = require("express"); // a function reference
const Post = require("../models/post"); // An object containing these four functions: insertPost, getPostsByAuthor, updatePost, deletePost
const router = express.Router(); // a function object


router
.post('/insert', async (req, res) => {
    try {
        const post = await Post.insertPost(req.body.content, req.body.authorId, req.body.authorName); // returns a promise
        res.send(post); // Send post info
    } catch (error) {
        res.status(401).send({ error: error.message});
}})

.get('/getPostsByAuthor/:authorId', async (req, res) => {
    try {
        const posts = await Post.getPostsByAuthor(req.params.authorId); // returns promise content (not wrapped promise)
        res.send(posts); // Send posts info
}catch(error){
        res.status(401).send({ message: error.message});
}})

.patch('/updatePost', async(req, res) => {try{
    const post = await Post.updatePost(req.body.userId, req.body.createdAt, req.body.content); // returns promise content (not wrapped promise)
    res.send(post); // Send the result object describing the update operation info.
} catch(error){
    res.status(401).send({message: error.message});
}})

.delete('/deletePost', async(req, res) => {try{
    await Post.deletePost(req.body.userId); // delete posts by user id
    res.send({message: "Posts deleted"});
} catch(error){
        res.status(401).send({message: error.message});
}})

module.exports = router; // export the router object to be used in index.js
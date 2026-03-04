// HTTP method: GET, POST, PUT, DELETE

const express = require("express"); // a function reference
const User = require("../models/user"); // An object containing these four functions: register, login, updatePassword, deleteUser
const router = express.Router(); // a function object


router
.post('/login', async (req, res) => {
    try {
        const user = await User.login(req.body.username, req.body.password); // returns a promise
        res.send({...user}); // Send user info without password
    } catch (error) {
        res.status(401).send({ error: error.message});
}})

.post('/register', async (req, res) => {
    try {
        const user = await User.register(req.body.username, req.body.password); // returns promise content (not wrapped promise)
        res.send({...user}); // Send user info without password
}catch(error){
        res.status(401).send({ message: error.message});
}})

.put('/update', async(req, res) => {try{
    const user = await User.updatePassword(req.body.id, req.body.password); // returns promise content (not wrapped promise)
    res.send(user); // Send the result object describing the update operation info.
} catch(error){
    res.status(401).send({message: error.message});
}})

.delete('/delete', async(req, res) => {try{
    await User.deleteUser(req.body.id); // returns promise content (not wrapped promise)
    res.send({message: "Account deleted"});
} catch{
        res.status(401).send({message: error.message});
}})

module.exports = router; // export the router object to be used in index.js
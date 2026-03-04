const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
username:{type:String, unique:true, required:true},
password:{type:String, required:true},
followers:[String],
following:[String]
})

const User = mongoose.model("User", userSchema);

// Create CRUD operations for User model

// Create User
async function register(username, password) {
    const user = await getUser(username); // get the promise content (not wrapped promise)
    if(user) throw Error("Username already in use");

    const newUser = await User.create({
        username: username,
        password: password
    });

    return newUser;
}

// Login User
async function login(username, password) {
    const user = await getUser(username); // get the promise content (not wrapped promise)
    if(!user) throw new Error("User not found");
    if(user.password !== password) throw new Error("Wrong password");
    return user;
}   

// Update
async function updatePassword(id, password) {
    const user = await User.updateOne({"_id": id}, {$set:{password: password}});
    return user; // A result object describing the update operation info.
}

// Delete
async function deleteUser(id) {
    await User.deleteOne({"_id": id});
}

// utility/helper function: Code Reuse
async function getUser(username) {
    return await User.findOne({ "username": username}); // returns a Data wrapped promise
}

// export the functions (we need them in route files)
module.exports = {
    register,
    login,
    updatePassword,
    deleteUser
}
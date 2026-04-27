const mongoose=require("mongoose");
const bcrypt = require("bcryptjs"); // for password hashing


const userSchema = new mongoose.Schema({
username:{type:String, unique:true, required:true},
password:{type:String, required:true},
followers:[String],
following:[String]
})

const User = mongoose.model("User", userSchema);

function ensureConnected() {
    if (mongoose.connection.readyState !== 1) {
        throw new Error("Database not connected");
    }
}

// Create CRUD operations for User model

// Create User
async function register(username, password) {
    ensureConnected();
    const user = await getUser(username); // get the promise content (not wrapped promise)
    if(user) throw Error("Username already in use");

    const salt = await bcrypt.genSalt(10); // generate a salt for hashing: time consuming operation, so we await it (hard to Brute Force attack - 2^10 = 1024 rounds of hashing)
    const hashed = await bcrypt.hash(password, salt); // hash the password with the salt: it repeatedly runs a computationally expensive key schedule that mixes the password and the salt over those 1,024 rounds, producing a final hash that is stored in the database. This makes it computationally expensive for attackers to guess passwords through brute-force attacks, as they would need to perform the same hashing process for each guess, significantly slowing down their attempts.


    const newUser = await User.create({
        username: username,
        password: hashed
    });
    const {password: leaveIt, ...secureUser } = newUser._doc;
    return secureUser; // return the document content (not wrapped promise)
}

// Login User
async function login(username, password) {
    ensureConnected();
    const user = await getUser(username); // get the promise content (not wrapped promise)
    if(!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password); // compare the provided password with the hashed password
    if(!isMatch) throw new Error("Wrong password");

    const {password: leaveIt, ...secureUser } = user._doc;
    return secureUser; // return the document content (not wrapped promise)
}   

// Update
async function updatePassword(id, password) {
    ensureConnected();
    const user = await User.updateOne({"_id": id}, {$set:{password: password}});
    return user; // A result object describing the update operation info.
}

// Delete
async function deleteUser(id) {
    ensureConnected();
    await User.deleteOne({"_id": id});
}

// utility/helper function: Code Reuse
async function getUser(username) {
    ensureConnected();
    return await User.findOne({ "username": username}); // returns a Data wrapped promise
}

// export the functions (we need them in route files)
module.exports = {
    register,
    login,
    updatePassword,
    deleteUser
}

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const User = {
    userID: String,
    username:String,
    password:String,
    userType:String,
    userInfo:String
}

const UserModel = mongoose.model("user",new Schema(User))
module.exports = UserModel
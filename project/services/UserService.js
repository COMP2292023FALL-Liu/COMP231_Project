const UserModel = require("../model/UserModel")
const UserService = {
	addUser: (userID, username, password,userType,userInfo) => {
		return UserModel.create({
			userID, username, password, userType,userInfo
		})
	},

	updateUser: (_id, userID, username, password,userType,userInfo) => {
		return UserModel.updateOne({
			_id
		}, {
			userID, username, password,userType,userInfo
		})
	},
	deleteUser: (_id) => {
		return UserModel.deleteOne({
			_id: _id
		})
	},
	getUser: (page, limit) => {
		return UserModel.find({}, ["username", "age"]).sort({
			age: -1
		}).skip((page - 1) * limit).limit(limit)
	},
	login: (username, password) => {
		return UserModel.find({
		  username: username,
		  password: password 
		});
	  }
}


module.exports = UserService
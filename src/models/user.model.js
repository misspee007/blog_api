const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserModel = new Schema({
	created_at: Date,
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: {
		type: String,
		required: true,
    unique: true,
    index: true,
	},
	password: { type: String, required: true },
	x: String,
	articles: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
});

// Apply the uniqueValidator plugin to the user model
UserModel.plugin(uniqueValidator);

UserModel.pre("save", async function (next) {
	const user = this;
	const hash = await bcrypt.hash(this.password, 10);

	this.password = hash;
	next();
});

UserModel.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);

	return compare;
};

const User = mongoose.model("Users", UserModel);

module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const UserModel = new Schema({
	id: ObjectId,
	created_at: Date,
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: {
    type: String,
    required: true,
    unique: [true, "User with this email already exists"],
  },
	password: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
});

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

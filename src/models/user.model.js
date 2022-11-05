const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
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
  // password should allow up to 255 characters

	password: { type: String, required: true },
	x: String,
	articles: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
});

// Apply the uniqueValidator plugin to the user model
UserModel.plugin(uniqueValidator);

UserModel.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password") || user.isNew) {
		const hash = await bcrypt.hash(this.password, 10);

		this.password = hash;
	} else {
		return next();
	}
});

// call pre hook on insertMany for seeder
UserModel.pre("insertMany", async function (next, docs) {
  if (Array.isArray(docs) && docs.length) {
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const hash = await bcrypt.hash(doc.password, 10);
      doc.password = hash;
    }
  }
});

UserModel.methods.isValidPassword = async function (password) {
	const user = this;

	const match = await bcrypt.compare(password, user.password);

	return match;
};

const User = mongoose.model("Users", UserModel);

module.exports = User;

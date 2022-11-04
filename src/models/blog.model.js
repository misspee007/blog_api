const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const BlogSchema = new Schema({
	title: { type: String, required: true, unique: true, index: true },
	description: String,
	tags: [String],
	author: { type: Schema.Types.ObjectId, ref: "Users" },
	timestamp: Date,
	state: { type: String, enum: ["draft", "published"], default: "draft" },
	readCount: { type: Number, default: 0 },
	readingTime: String,
	body: { type: String, required: true },
});

// Apply the uniqueValidator plugin to the blog model
BlogSchema.plugin(uniqueValidator);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;

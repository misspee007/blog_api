const mongoose = require("mongoose");

const { Schema } = mongoose;

const ObjectId = Schema.ObjectId;

const BlogSchema = new Schema({
	id: ObjectId,
	title: { type: String, required: true, unique: [true, "Article with this title already exists"] },
	description: String,
	tags: [String],
  author: { type: Schema.Types.ObjectId, ref: "User" },
	timestamp: Date,
	state: { type: String, enum: ["draft", "published"], default: "draft" },
	readCount: { type: Number, default: 0 },
	readingTime: String,
	body: { type: String, required: true },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;

exports.userAuth = (req, res, next, authorId) => {
	// if author is not the same as the logged in user, throw error
	if (authorId !== req.user._id) {
    console.log(typeof authorId, typeof req.user._id);
    console.log("authorId", authorId);
    console.log("req.user._id", req.user._id);
		return next({
			status: 401,
			message: "You are not authorized to access this resource",
		});
	}
};

exports.calculateReadingTime = (text) => {
	// calculate reading time
	// let wordCount = body.split(" ").length;
	const wordsPerMin = 200;
	const wordCount = text.trim().split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / wordsPerMin);

	return readingTime;
};

exports.userAuth = (req, res, next, authorId) => {
	// if author is not the same as the logged in user, throw error
	if (req.user._id !== authorId.toString()) {
		return next({
			status: 401,
			message: "You are not authorized to access this resource",
		});
	}
};

exports.calculateReadingTime = (text) => {
	const wordsPerMin = 200;
	const wordCount = text.trim().split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / wordsPerMin);

	return readingTime > 1 ? `${readingTime} mins` : `${readingTime} min`;
};

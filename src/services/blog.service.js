exports.userAuth = (req, res, next, authorId) => {
	// if author is not the same as the logged in user, throw error
	if (req.user.email !== authorId) {
		return next({
			status: 401,
			message: "You are not authorized to access this resource",
		});
	}

  next();
};

exports.calculateReadingTime = (text) => {
	// calculate reading time
	// let wordCount = body.split(" ").length;
	const wordsPerMin = 200;
	const wordCount = text.trim().split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / wordsPerMin);

	return readingTime;
};

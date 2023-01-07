const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true
});

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

exports.uploadImage = async (req, res, next) => {
  const filePath = req.files.file.tempFilePath;

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const uploadedImage = await cloudinary.uploader.upload(filePath, options);

    return uploadedImage.secure_url;
  } catch (error) {
    return next(error);
  }

}
require("dotenv").config();

module.exports = {
	PORT: process.env.PORT,
	MONGODB_CONNECTION_URL: process.env.MONGODB_CONNECTION_URL,
	JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};

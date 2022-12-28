require("dotenv").config();

module.exports = {
	PORT: process.env.PORT,
	MONGODB_CONNECTION_URL: process.env.MONGODB_CONNECTION_URL,
	JWT_SECRET: process.env.JWT_SECRET,
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
  AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_SECRET: process.env.AUTH0_SECRET,
};

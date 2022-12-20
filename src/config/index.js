require("dotenv").config();

module.exports = {
	PORT: process.env.PORT,
	MONGODB_CONNECTION_URL: process.env.MONGODB_CONNECTION_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	SENTRY_DSN: process.env.SENTRY_DSN,
};

const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const auth0Config = require("./src/authentication/auth0");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { logger, httpLogger } = require("./src/loggers");
const { blogRouter, authRouter, authorRouter } = require("./src/routes");

const CONFIG = require("./src/config");

// Signup and login authentication middleware
require("./src/authentication/passport");

const app = express();

// Middleware
app.use(cors());

app.use(httpLogger);

app.use(auth(auth0Config));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: true,
	message: "Too many requests, please try again after 15 minutes",
});
app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// Routes
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/auth", authRouter);
app.use(
	"/api/v1/author/blog",
	passport.authenticate("jwt", { session: false }),
	authorRouter
);

app.get("/", (req, res) => {
	return res.json({ status: true });
});

// 404 route
app.use("*", (req, res) => {
	return res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use(function (err, req, res, next) {
	logger.error(err.message);
	res.status(err.status || 500).send("Oops, something failed");
});

module.exports = app;

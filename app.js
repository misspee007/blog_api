const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { blogRouter, authRouter, authorRouter } = require("./src/routes");

require("dotenv").config();

// Signup and login authentication middleware
require("./src/authentication/passport");

const app = express();

// Middleware
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

// Routes
app.use("/blog", blogRouter);
app.use("/auth", authRouter);
app.use(
	"/author/blog",
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
	// console.log(err);
	return res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

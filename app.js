const express = require("express");
const passport = require("passport");
const { blogRouter, authRouter, authorRouter } = require("./src/routes");

require("dotenv").config();

// Signup and login authentication middleware
require("./src/authentication/passport");

const app = express();

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'route not found' })
})

// Error Handler
app.use(function (err, req, res, next) {
	console.log(err);
	return res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

const express = require("express");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { blogRouter, authRouter, authorRouter } = require("./src/routes");

require("dotenv").config();

// Signup and login authentication middleware
require("./src/authentication/passport");

const app = express();

// Middleware
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Tracing.Integrations.Express({ app }),
	],

	// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
	tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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

// Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// Fallthrough Error Handler
app.use(function onError(err, req, res, next) {
	// console.log(err);
	return res.status(err.status || 500).end(res.sentry + "\n");
});

module.exports = app;

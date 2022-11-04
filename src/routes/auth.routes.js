const express = require("express");
const passport = require("passport");

const { authController } = require("../controllers");

const authRouter = express.Router();

// signup
authRouter.post(
	"/signup",
	passport.authenticate("signup", { session: false }),
	authController.signup
);

// login
authRouter.post("/login", async (req, res, next) =>
	passport.authenticate("login", (err, user, info) => {
		authController.login(req, res, { err, user, info });
	})(req, res, next)
);

module.exports = authRouter;

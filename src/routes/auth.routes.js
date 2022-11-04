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
authRouter.post("/login", authController.login);

module.exports = authRouter;

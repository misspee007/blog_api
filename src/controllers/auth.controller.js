const passport = require("passport");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

exports.signup = async (req, res, next) => {
	const { firstname, lastname, email, password } = req.body;

	try {
		const user = new UserModel({
			firstname: firstname,
			lastname: lastname,
			email: email,
			password: password,
		});

		user.save((err, user) => {
			if (err) {
				console.log(`err: ${err}`);
				return next(err);
			}
		});

		delete user.password;

		return res.status(201).json({
			message: "Signup successful",
			user: user,
		});
	} catch (error) {
		return next(error);
	}
};

exports.login = (req, res, { err, user, info }) => {
	if (!user) {
		return res.status(401).json({ message: "email or password is incorrect" });
	}

	req.login(user, { session: false }, async (error) => {
		if (error) return res.status(401).json({ message: error });

		const body = { _id: user._id, email: user.email };

		const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(200).json({ token });
	});
};

exports.login2 = async (req, res, next) => {
	passport.authenticate("login", async (err, user, info) => {
		try {
			if (err) {
				return next(err);
			}
			console.log(`user: ${user}`);
			if (!user) {
				return next({ status: 401, message: "email or password is incorrect" });
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);

				const body = { _id: user._id, email: user.email };

				const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});

				return res.status(200).json({ token });
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
};

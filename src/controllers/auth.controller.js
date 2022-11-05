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
    console.log("FROM LOGIN: ", `err: ${err}, user: ${user}, info: ${info}`);
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

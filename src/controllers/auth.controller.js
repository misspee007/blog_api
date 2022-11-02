const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

exports.signup = async (req, res, next) => {
	const { firstname, lastname, email, password } = req.body;

	try {
		const user = await UserModel.create({
			firstname,
			lastname,
			email,
			password,
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

exports.login = (req, res, next, { err, user, info }) => {
	if (!user) {
		return next({ message: "email or password is incorrect" });
	}

	req.login(user, { session: false }, async (error) => {
		if (error) return next(error);

		const body = { _id: user._id, email: user.email };

		const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(200).json({ token });
	});
};

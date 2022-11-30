const Joi = require("joi");

const validateUserMiddleware = async (req, res, next) => {
	const user = req.body;
	try {
		await userValidator.validateAsync(user);
		next();
	} catch (error) {
		return next({ status: 406, message: error.details[0].message });
	}
};

const userValidator = Joi.object({
	firstname: Joi.string().min(2).max(30).required(),
	lastname: Joi.string().min(2).max(30).required(),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ["com", "net"] },
	}),
  password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")).required(),
});

module.exports = validateUserMiddleware;
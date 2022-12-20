const Joi = require("joi");

const newArticleValidationSchema = Joi.object({
	title: Joi.string().trim().required(),
	body: Joi.string().trim().required(),
	description: Joi.string().trim(),
	tags: Joi.string().trim(),
});

const updateArticleValidationSchema = Joi.object({
	title: Joi.string().trim(),
	body: Joi.string().trim(),
	description: Joi.string().trim(),
	tags: Joi.string().trim(),
});

const newArticleValidationMW = async (req, res, next) => {
	const article = req.body;
	try {
		await newArticleValidationSchema.validateAsync(article);
		next();
	} catch (error) {
		return next({ status: 406, message: error.details[0].message });
	}
};

const updateArticleValidationMW = async (req, res, next) => {
	const article = req.body;
	try {
		await updateArticleValidationSchema.validateAsync(article);
		next();
	} catch (error) {
		return next({ status: 406, message: error.details[0].message });
	}
};

module.exports = {
	newArticleValidationMW,
	updateArticleValidationMW,
};

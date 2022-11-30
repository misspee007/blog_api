const Joi = require("joi");

const validateArticleMiddleware = async (req, res, next) => {
	const article = req.body;
	try {
		await articleValidator.validateAsync(article);
		next();
	} catch (error) {
		return next({ status: 406, message: error.details[0].message });
	}
};

const articleValidator = Joi.object({
	title: Joi.string().required(),
	body: Joi.string().required(),
	description: Joi.string(),
	tags: Joi.string(),
});

module.exports = validateArticleMiddleware;

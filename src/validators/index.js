const userValidator = require("./user.validator");
const {
	newArticleValidationMW,
	updateArticleValidationMW,
} = require("./author.validator");

module.exports = {
	userValidator,
	newArticleValidationMW,
	updateArticleValidationMW,
};

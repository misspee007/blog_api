const { getArticle, getPublishedArticles } = require("./blog");
const {
	createArticle,
	deleteArticle,
	editArticle,
	editState,
	getAuthorBlog,
} = require("./author");
const { login, signup } = require("./auth");

module.exports = {
	paths: {
		"/api/v1/auth/login": {
			post: login.post,
		},
		"/api/v1/auth/signup": {
			post: signup.post,
		},
		"/api/v1/blog": {
			get: getPublishedArticles.get,
		},
		"/api/v1/blog/{id}": {
			get: getArticle.get,
		},
		"/api/v1/author/blog": {
			post: createArticle.post,
			get: getAuthorBlog.get,
		},
		"/api/v1/author/blog/delete/{id}": {
			delete: deleteArticle.delete,
		},
		"/api/v1/author/blog/edit/{id}": {
			patch: editArticle.patch,
		},
		"/api/v1/author/blog/edit/state/{id}": {
			patch: editState.patch,
		},
	},
};

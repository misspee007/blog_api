const { BlogModel, UserModel } = require("../models");
const { blogService } = require("../services");
const moment = require("moment");

// create a new article
exports.createArticle = async (req, res, next) => {
	try {
		const newArticle = req.body;

		// calculate reading time
		const readingTime = blogService.calculateReadingTime(newArticle.body);

		const article = new BlogModel({
			author: req.user._id,
			timestamp: moment().toDate(),
			readingTime: `${readingTime} min read`,
			...newArticle,
		});

		article.save((err, user) => {
			if (err) {
				console.log(`err: ${err}`);
				return next(err);
			}
		});

		// add article to user's articles array in the database
		const user = await UserModel.findById(req.user._id);
		user.articles.push(article._id);
		await user.save();

		return res.status(201).json({
			message: "Article created successfully",
			article: article,
		});
	} catch (error) {
		return next(error);
	}
};

// change state
exports.editState = async (req, res, next) => {
	try {
		const { articleId } = req.params;
		const { state } = req.body;

		// check article current state
		const article = await BlogModel.findById(articleId).populate("author", "email");

		// check if user is authorised to change state
		blogService.userAuth(req, res, next, article.author.email);

		// validate request
		if (state !== "published" && state !== "draft") {
			return next({ status: 400, message: "Invalid state" });
		}

		if (article.state === state) {
			return next({ status: 400, message: "Article already in this state" });
		}

		article.state = state;
		article.timestamp = moment().toDate();

		await article.save();

		return res.status(204).json({
			message: "State successfully updated",
			article: article,
		});
	} catch (error) {
		return next(error);
	}
};

// edit article
exports.editArticle = async (req, res, next) => {
	try {
		const { articleId } = req.params;
		const { title, body, tags, description } = req.body;

    // check if user is authorised to edit article
    const article = await BlogModel.findById(articleId);
    blogService.userAuth(req, res, next, article.author._id);

		// if params are provided, update them
		if (title) {
			article.title = title;
		}
		if (body) {
			article.body = body;
			article.readingTime = blogService.calculateReadingTime(body);
		}
		if (tags) {
			article.tags = tags;
		}
    if (description) {
      article.description = description;
    }
		if (title || body || tags || description) {
			article.timestamp = moment().toDate();
		}

		await article.save();

		return res.status(204).json({
			message: "Article successfully edited and saved",
			article: article,
		});
	} catch (error) {
		return next(error);
	}
};

// delete article
exports.deleteArticle = async (req, res, next) => {
	try {
		const { articleId } = req.params;

		const article = await BlogModel.findById(articleId);

		// check if user is authorised to delete article
		blogService.userAuth(req, res, next, article.author._id);

		await article.remove();

		return res.status(204).json({
			message: "Article successfully deleted",
		});
	} catch (error) {
		return next(error);
	}
};

// get all articles created by the user
exports.getArticlesByAuthor = async (req, res, next) => {
	try {
		const {
			state,
			order = "asc",
			order_by = "created_at",
			page = 1,
			per_page = 20,
		} = req.query;

		const findQuery = {};

		// check if state is valid and if it is, add it to the query
		if (state) {
			if (state !== "published" && state !== "draft") {
				return next({ status: 400, message: "Invalid state" });
			} else {
				findQuery.state = state;
			}
		}

		// sort
		const sortQuery = {};

		const sortAttributes = order_by.split(",");

		for (const attribute of sortAttributes) {
			if (order === "asc") {
				sortQuery[attribute] = 1;
			}

			if (order === "desc" && order_by) {
				sortQuery[attribute] = -1;
			}
		}

		// get user's articles
		const user = await UserModel.findById(req.user._id).populate({
			path: "articles",
			match: findQuery,
			options: {
				sort: sortQuery,
				limit: parseInt(per_page),
				skip: (page - 1) * per_page,
			},
		});

		return res.status(200).json({
			message: "Request successful",
			articles: user.articles,
		});
	} catch (error) {
		return next(error);
	}
};

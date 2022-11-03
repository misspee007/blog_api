const express = require("express");
const { blogController } = require("../controllers");

const blogRouter = express.Router();

// get all published articles
blogRouter.get("/", blogController.getPublishedArticles);

// Get article by ID
blogRouter.get("/:articleId", blogController.getArticle);

module.exports = blogRouter;

const express = require("express");
const authorController = require("../controllers");

const authorRouter = express.Router();

// create a new article
authorRouter.post("/", authorController.createArticle);

// change state
authorRouter.patch("/:articleId/state", authorController.editState);

// edit article
authorRouter.patch("/:articleId", authorController.editArticle);

// delete article
authorRouter.delete("/:articleId", authorController.deleteArticle);

// get all articles created by the author
authorRouter.get("/", authorController.getArticlesByAuthor);

module.exports = authorRouter;

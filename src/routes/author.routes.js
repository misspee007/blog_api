const express = require("express");
const { authorController } = require("../controllers");
const { authorValidator } = require("../validators");

const authorRouter = express.Router();

// create a new article
authorRouter.post("/", authorValidator, authorController.createArticle);

// change state
authorRouter.patch("/edit/state/:articleId", authorController.editState);

// edit article
authorRouter.patch("/edit/:articleId", authorController.editArticle);

// delete article
authorRouter.delete("/delete/:articleId", authorController.deleteArticle);

// get all articles created by the author
authorRouter.get("/", authorController.getArticlesByAuthor);

module.exports = authorRouter;

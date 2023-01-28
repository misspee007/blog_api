const getArticle = require("./blog/get-article");
const getPublishedArticles = require("./blog/get-all-published");

module.exports = {
  paths: {
    "/api/v1/blog/{id}": {
      get: getArticle.get,
    },
    "/api/v1/blog": {
      get: getPublishedArticles.get,
    },
  }
}
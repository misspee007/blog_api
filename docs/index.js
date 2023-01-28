const basicInfo = require('./basicInfo');
const servers = require('./servers');
const tags = require('./tags');
const components = require('./components');
const paths = require('./paths.js');

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  ...paths,
};
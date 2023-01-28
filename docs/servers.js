const CONFIG = require('../src/config');

module.exports = {
  servers: [
    {
      url: `http://localhost:${CONFIG.PORT}`,
      description: 'Local server',
    },
    {
      url: 'https://pda-blog.cyclic.app',
      description: 'Production server',
    },
  ],
};
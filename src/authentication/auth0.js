const CONFIG = require("../config");

const auth0Config = {
	authRequired: false,
	auth0Logout: true,
	baseURL: CONFIG.AUTH0_BASE_URL,
	clientID: CONFIG.AUTH0_CLIENT_ID,
	issuerBaseURL: CONFIG.AUTH0_ISSUER_BASE_URL,
	secret: CONFIG.AUTH0_SECRET,
};

module.exports = auth0Config;

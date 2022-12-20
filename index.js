const app = require("./app");
const { database } = require("./src/database");

const CONFIG = require("./src/config");

database.connect(CONFIG.MONGODB_CONNECTION_URL);

app.listen(CONFIG.PORT, () => {
	console.log(`server listening on port ${CONFIG.PORT}`);
});

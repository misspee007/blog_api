const app = require('./app');
const PORT = process.env.PORT || 3000;
const Database = require('./database');

Database.connect(process.env.MONGODB_CONNECTION_URL);

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
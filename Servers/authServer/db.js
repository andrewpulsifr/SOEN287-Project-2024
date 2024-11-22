const createConnection = require('../../api/config/database'); // Adjust the path if necessary

const db = createConnection();

module.exports = db;

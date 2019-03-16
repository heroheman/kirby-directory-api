// Setup the DB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  plugins: [],
  themes: [],
  last_updated: ''
}).write();

export default db;

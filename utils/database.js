let mongoose = require('mongoose');
const config = require('./env.js');
class Database {
  constructor() {
    this.opts = { useNewUrlParser: true };
    this._connect()
  }
  _connect() {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('debug', true);
    mongoose.connect(`mongodb://${config.server}/${config.DB_NAME}`,this.opts)
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error' + err)
      })
  }
}
module.exports = new Database();
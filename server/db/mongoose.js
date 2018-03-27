var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://ebuka:ebuka@ds125489.mlab.com:25489/todoapp' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
const mongoose = require('mongoose'),
      schema = mongoose.Schema;

var record = new schema({
  "term": String,
  "time": String
});

var recordModel = mongoose.model('recordModel', record);

module.exports = recordModel;

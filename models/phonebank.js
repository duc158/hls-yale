const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phonebankSchema = new Schema({
  candidate: String,
  location: String,
  office: String,
  party: String,
  link: String,
  callDate: String
});

module.exports = mongoose.model('Phonebanks', phonebankSchema);

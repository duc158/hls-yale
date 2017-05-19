const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phonebankSchema = new Schema({
  candidate: String,
  office: String,
  party: String,
  link: String,
  callDate: String,
  zipcode: String,
  location: String,
  flag: Boolean
});

module.exports = mongoose.model('Phonebanks', phonebankSchema);

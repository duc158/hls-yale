const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  candidate: String,
  office: String,
  party: String,
  link: String,
  electionDate: String,
  location: String,
  zipcode: String,
  flag: Boolean
});

module.exports = mongoose.model('campaign', campaignSchema);

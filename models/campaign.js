const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  candidate: String,
  office: String,
  party: String,
  electionDate: String,
  zipcode: String,
  location: String,
  flag: Boolean
});

module.exports = mongoose.model('campaign', campaignSchema);

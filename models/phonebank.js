const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const phonebankSchema = new Schema({
  candidateName: String,
  officeRunning: String,
  candidateParty: String,
  phonebankLink: String,
  intendedDate: String
});

module.exports = mongoose.model('Phonebanks', phonebankSchema);

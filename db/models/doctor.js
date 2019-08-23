const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let doctorSchema = new Schema({
  email: String,
  name: String,
  interest: { type: Array, default: void 0 }
});

var doctorModel = mongoose.model('doctor', doctorSchema );
module.exports = doctorModel
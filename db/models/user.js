const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let userSchema = new Schema({
  email: String,
  name: String,
});

var userModel = mongoose.model('user', userSchema );
module.exports = userModel
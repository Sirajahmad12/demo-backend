const mongoose = require('mongoose');
const contactUsSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    country: String,
    state: String,
    city: String,
    gender: String,
    dob: String,
    age: String,
  });
  
const User = mongoose.model('User', contactUsSchema);

module.exports = {
    User
};
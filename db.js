const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
})

const UserModel = mongoose.model('users', userSchema);

module.exports = {
  UserModel
}

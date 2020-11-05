const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = Schema({
    name: String,
    surname: String,
    nickname: String,
    email: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);
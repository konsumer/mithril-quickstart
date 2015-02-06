var mongoose = require('mongoose');
var Email = require('mongoose-type-email');

var UserSchema = new mongoose.Schema({
    email: {type: Email, required:true, unique:true},
    password: {type: String, required:true}, // used with bcrypt
    verified: {type:Boolean, default:false}
});

UserSchema.plugin(require('mongoose-bcrypt'));
var User = module.exports = mongoose.model('User', UserSchema);
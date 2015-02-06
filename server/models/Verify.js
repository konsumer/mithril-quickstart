var mongoose = require('mongoose');
var Relation = require('mongoose-type-relation');

function generateCode(){
	return Math.random().toString(36).slice(-8);
}


var VerifySchema = new mongoose.Schema({
    user: {type: Relation, required:true, ref: 'User'},
    code: {type: String, default: generateCode}
});

var Verify = module.exports = mongoose.model('Verify', VerifySchema);
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a right rol'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'The name is necessary'] },
    email: {type:String, unique: true, required: [true, "The email is necessary"]},
    password: {type: String, required: [true, 'The password is necessary']},
    img: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE', enum: validRoles }
});

userSchema.plugin( uniqueValidator, {message: 'The {PATH} must be unique'});

module.exports = mongoose.model('User', userSchema);

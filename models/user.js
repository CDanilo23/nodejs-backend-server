var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, required: [true, 'The name is necessary'] },
    email: {type:String, required: [true, "The email is necessary"]},
    password: {type: String, required: [true, 'The password is necessary']},
    img: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE' }
});


module.exports = mongoose.model('User', userSchema);

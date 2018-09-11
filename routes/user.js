var express = require('express');

var app = express();

var User = require('../models/user');

//================================
// Get all users
//================================

app.get('/', (req, res, next) => {

    User.find({}, 'name email img role')
        .exec(
            (err, users) => {
        
                if(err){
                    return res.status(500).json({
                    ok: false,
                    message: 'Error getting users',
                    errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    users: users,
                    });          
                
    });

});

//================================
// Create new user
//================================

app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {

        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error saving user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved,
            });          
    });


} );

module.exports = app;